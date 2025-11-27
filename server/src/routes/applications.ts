import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all applications (for job seeker or employer)
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let query = '';
    let params: any[] = [];

    if (currentUser.role === 'jobseeker') {
      // Job seeker sees their own applications
      query = `
        SELECT a.*, v.title as job_title, v.company, v.location, v.salary_min, v.salary_max,
               v.work_type, u.first_name as employer_first_name, u.last_name as employer_last_name
        FROM applications a
        JOIN vacancies v ON a.vacancy_id = v.id
        JOIN users u ON v.employer_id = u.id
        WHERE a.job_seeker_id = $1
        ORDER BY a.applied_at DESC
      `;
      params = [currentUser.id];
    } else if (currentUser.role === 'employer') {
      // Employer sees applications for their vacancies
      query = `
        SELECT a.*, v.title as job_title, v.company, v.location,
               u.first_name as job_seeker_first_name, u.last_name as job_seeker_last_name,
               u.email as job_seeker_email, u.phone as job_seeker_phone
        FROM applications a
        JOIN vacancies v ON a.vacancy_id = v.id
        JOIN users u ON a.job_seeker_id = u.id
        WHERE v.employer_id = $1
        ORDER BY a.applied_at DESC
      `;
      params = [currentUser.id];
    } else if (currentUser.role === 'admin') {
      // Admin sees all applications
      query = `
        SELECT a.*, v.title as job_title, v.company, v.location,
               u.first_name as job_seeker_first_name, u.last_name as job_seeker_last_name,
               u.email as job_seeker_email
        FROM applications a
        JOIN vacancies v ON a.vacancy_id = v.id
        JOIN users u ON a.job_seeker_id = u.id
        ORDER BY a.applied_at DESC
      `;
      params = [];
    } else {
      return res.status(403).json({ error: 'Access denied' });
    }

    const result = await pool.query(query, params);
    
    const applications = result.rows.map(a => ({
      id: a.id.toString(),
      vacancyId: a.vacancy_id.toString(),
      jobSeekerId: a.job_seeker_id.toString(),
      status: a.status,
      matchScore: a.match_score,
      notes: a.notes,
      appliedAt: a.applied_at,
      updatedAt: a.updated_at,
      jobTitle: a.job_title,
      company: a.company,
      location: a.location,
      ...(currentUser.role === 'jobseeker' && {
        employerName: `${a.employer_first_name} ${a.employer_last_name}`,
        salaryMin: a.salary_min,
        salaryMax: a.salary_max,
        workType: a.work_type,
      }),
      ...(currentUser.role !== 'jobseeker' && {
        jobSeekerName: `${a.job_seeker_first_name} ${a.job_seeker_last_name}`,
        jobSeekerEmail: a.job_seeker_email,
        jobSeekerPhone: a.job_seeker_phone,
      }),
    }));

    res.json(applications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Create application (job seeker only)
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can apply' });
    }

    const { vacancyId } = req.body;
    const jobSeekerId = currentUser.id;

    // Check if vacancy exists
    const vacancyResult = await pool.query(
      'SELECT * FROM vacancies WHERE id = $1 AND status = $2',
      [vacancyId, 'active']
    );

    if (vacancyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found or not active' });
    }

    // Check if already applied
    const existingResult = await pool.query(
      'SELECT id FROM applications WHERE vacancy_id = $1 AND job_seeker_id = $2',
      [vacancyId, jobSeekerId]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Already applied to this vacancy' });
    }

    // Calculate match score (simplified - can be enhanced with AI)
    const matchScore = await calculateMatchScore(jobSeekerId, vacancyId);

    // Create application
    const result = await pool.query(
      `INSERT INTO applications (vacancy_id, job_seeker_id, match_score, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [vacancyId, jobSeekerId, matchScore, 'pending']
    );

    const application = result.rows[0];
    res.status(201).json({
      id: application.id.toString(),
      vacancyId: application.vacancy_id.toString(),
      jobSeekerId: application.job_seeker_id.toString(),
      status: application.status,
      matchScore: application.match_score,
      appliedAt: application.applied_at,
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// Update application status (employer only)
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const currentUser = req.user;
    const { status, notes } = req.body;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if application exists and user has permission
    const applicationResult = await pool.query(
      `SELECT a.*, v.employer_id
       FROM applications a
       JOIN vacancies v ON a.vacancy_id = v.id
       WHERE a.id = $1`,
      [applicationId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = applicationResult.rows[0];

    // Only employer or admin can update status
    if (currentUser.role !== 'admin' && currentUser.id !== application.employer_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update application
    const updateResult = await pool.query(
      `UPDATE applications
       SET status = COALESCE($1, status),
           notes = COALESCE($2, notes)
       WHERE id = $3
       RETURNING *`,
      [status, notes, applicationId]
    );

    const updated = updateResult.rows[0];
    res.json({
      id: updated.id.toString(),
      vacancyId: updated.vacancy_id.toString(),
      jobSeekerId: updated.job_seeker_id.toString(),
      status: updated.status,
      matchScore: updated.match_score,
      notes: updated.notes,
      appliedAt: updated.applied_at,
      updatedAt: updated.updated_at,
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application (withdraw)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const currentUser = req.user;

    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if application exists
    const applicationResult = await pool.query(
      'SELECT job_seeker_id FROM applications WHERE id = $1',
      [applicationId]
    );

    if (applicationResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = applicationResult.rows[0];

    // Only job seeker can delete their own application
    if (currentUser.role !== 'admin' && currentUser.id !== application.job_seeker_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM applications WHERE id = $1', [applicationId]);

    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

// Helper function to calculate match score
async function calculateMatchScore(jobSeekerId: number, vacancyId: number): Promise<number> {
  try {
    // Get job seeker resume skills
    const resumeResult = await pool.query(
      'SELECT skills FROM resumes WHERE user_id = $1',
      [jobSeekerId]
    );

    // Get vacancy required skills
    const vacancyResult = await pool.query(
      'SELECT skills FROM vacancies WHERE id = $1',
      [vacancyId]
    );

    if (resumeResult.rows.length === 0 || vacancyResult.rows.length === 0) {
      return 50; // Default score if no data
    }

    const resumeSkills = resumeResult.rows[0].skills || [];
    const vacancySkills = vacancyResult.rows[0].skills || [];

    if (vacancySkills.length === 0) {
      return 50;
    }

    // Calculate match percentage
    const matchedSkills = vacancySkills.filter((skill: string) =>
      resumeSkills.some((rs: string) => rs.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(rs.toLowerCase()))
    );

    const matchPercentage = Math.round((matchedSkills.length / vacancySkills.length) * 100);
    return Math.max(0, Math.min(100, matchPercentage));
  } catch (error) {
    console.error('Calculate match score error:', error);
    return 50; // Default score on error
  }
}

export default router;

