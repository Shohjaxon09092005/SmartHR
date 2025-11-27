import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get job matches for job seeker
router.get('/matches', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can view job matches' });
    }

    // Get job seeker resume
    const resumeResult = await pool.query(
      'SELECT skills FROM resumes WHERE user_id = $1',
      [currentUser.id]
    );

    const resumeSkills = resumeResult.rows.length > 0 ? (resumeResult.rows[0].skills || []) : [];

    // Get all active vacancies
    const vacanciesResult = await pool.query(
      `SELECT v.*, u.first_name, u.last_name
       FROM vacancies v
       LEFT JOIN users u ON v.employer_id = u.id
       WHERE v.status = 'active'
       ORDER BY v.created_at DESC`
    );

    // Calculate match scores
    const matches = vacanciesResult.rows.map(v => {
      const vacancySkills = v.skills || [];
      let matchScore = 50; // Default score

      if (vacancySkills.length > 0 && resumeSkills.length > 0) {
        const matchedSkills = vacancySkills.filter((skill: string) =>
          resumeSkills.some((rs: string) =>
            rs.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(rs.toLowerCase())
          )
        );
        matchScore = Math.round((matchedSkills.length / vacancySkills.length) * 100);
      }

      // Check if already applied
      let alreadyApplied = false;
      // We'll check this in a separate query for all matches

      return {
        id: v.id.toString(),
        title: v.title,
        company: v.company,
        location: v.location,
        description: v.description,
        workType: v.work_type,
        remoteWork: v.remote_work,
        salaryMin: v.salary_min,
        salaryMax: v.salary_max,
        salaryType: v.salary_type,
        experienceLevel: v.experience_level,
        experienceYears: v.experience_years,
        skills: v.skills || [],
        category: v.category,
        urgent: v.urgent,
        applicationDeadline: v.application_deadline,
        matchScore,
        createdAt: v.created_at,
      };
    });

    // Check which jobs are already applied to
    const applicationsResult = await pool.query(
      'SELECT vacancy_id FROM applications WHERE job_seeker_id = $1',
      [currentUser.id]
    );

    const appliedVacancyIds = new Set(
      applicationsResult.rows.map(a => a.vacancy_id.toString())
    );

    // Check which jobs are saved
    const savedJobsResult = await pool.query(
      'SELECT vacancy_id FROM saved_jobs WHERE user_id = $1',
      [currentUser.id]
    );

    const savedVacancyIds = new Set(
      savedJobsResult.rows.map(s => s.vacancy_id.toString())
    );

    // Add application and saved status
    const matchesWithStatus = matches.map(match => ({
      ...match,
      alreadyApplied: appliedVacancyIds.has(match.id),
      isSaved: savedVacancyIds.has(match.id),
    }));

    // Sort by match score descending
    matchesWithStatus.sort((a, b) => b.matchScore - a.matchScore);

    res.json(matchesWithStatus);
  } catch (error) {
    console.error('Get job matches error:', error);
    res.status(500).json({ error: 'Failed to fetch job matches' });
  }
});

// Save job
router.post('/:id/save', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can save jobs' });
    }

    const vacancyId = parseInt(req.params.id);

    // Check if vacancy exists
    const vacancyResult = await pool.query(
      'SELECT id FROM vacancies WHERE id = $1',
      [vacancyId]
    );

    if (vacancyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    // Check if already saved
    const existingResult = await pool.query(
      'SELECT id FROM saved_jobs WHERE user_id = $1 AND vacancy_id = $2',
      [currentUser.id, vacancyId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Job already saved' });
    }

    // Save job
    await pool.query(
      'INSERT INTO saved_jobs (user_id, vacancy_id) VALUES ($1, $2)',
      [currentUser.id, vacancyId]
    );

    res.json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Save job error:', error);
    res.status(500).json({ error: 'Failed to save job' });
  }
});

// Unsave job
router.delete('/:id/save', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can unsave jobs' });
    }

    const vacancyId = parseInt(req.params.id);

    await pool.query(
      'DELETE FROM saved_jobs WHERE user_id = $1 AND vacancy_id = $2',
      [currentUser.id, vacancyId]
    );

    res.json({ message: 'Job unsaved successfully' });
  } catch (error) {
    console.error('Unsave job error:', error);
    res.status(500).json({ error: 'Failed to unsave job' });
  }
});

// Get saved jobs
router.get('/saved', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can view saved jobs' });
    }

    const result = await pool.query(
      `SELECT v.*, sj.created_at as saved_at
       FROM saved_jobs sj
       JOIN vacancies v ON sj.vacancy_id = v.id
       WHERE sj.user_id = $1
       ORDER BY sj.created_at DESC`,
      [currentUser.id]
    );

    const savedJobs = result.rows.map(v => ({
      id: v.id.toString(),
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      workType: v.work_type,
      remoteWork: v.remote_work,
      salaryMin: v.salary_min,
      salaryMax: v.salary_max,
      salaryType: v.salary_type,
      experienceLevel: v.experience_level,
      experienceYears: v.experience_years,
      skills: v.skills || [],
      category: v.category,
      urgent: v.urgent,
      savedAt: v.saved_at,
      createdAt: v.created_at,
    }));

    res.json(savedJobs);
  } catch (error) {
    console.error('Get saved jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch saved jobs' });
  }
});

export default router;

