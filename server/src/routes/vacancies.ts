import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, requireRole, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const createVacancySchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  description: z.string().min(1),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  category: z.string().optional(),
  workType: z.string(),
  remoteWork: z.boolean().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.string().optional(),
  experienceLevel: z.string().optional(),
  experienceYears: z.string().optional(),
  skills: z.array(z.string()).optional(),
  applicationDeadline: z.string().optional(),
  vacanciesCount: z.number().optional(),
  urgent: z.boolean().optional(),
});

// Get all vacancies (public, but filtered by status)
router.get('/', async (req, res) => {
  try {
    const status = req.query.status as string || 'active';
    const search = req.query.search as string;
    const category = req.query.category as string;
    const location = req.query.location as string;

    let query = `
      SELECT v.*, u.first_name, u.last_name, u.email as employer_email,
             COUNT(a.id) as application_count
      FROM vacancies v
      LEFT JOIN users u ON v.employer_id = u.id
      LEFT JOIN applications a ON v.id = a.vacancy_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramCount = 0;

    if (status) {
      paramCount++;
      query += ` AND v.status = $${paramCount}`;
      params.push(status);
    }

    if (search) {
      paramCount++;
      query += ` AND (v.title ILIKE $${paramCount} OR v.company ILIKE $${paramCount} OR v.description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    if (category) {
      paramCount++;
      query += ` AND v.category = $${paramCount}`;
      params.push(category);
    }

    if (location) {
      paramCount++;
      query += ` AND v.location ILIKE $${paramCount}`;
      params.push(`%${location}%`);
    }

    query += ` GROUP BY v.id, u.first_name, u.last_name, u.email ORDER BY v.created_at DESC`;

    const result = await pool.query(query, params);

    const vacancies = result.rows.map(v => ({
      id: v.id.toString(),
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities,
      benefits: v.benefits,
      category: v.category,
      workType: v.work_type,
      remoteWork: v.remote_work,
      salaryMin: v.salary_min,
      salaryMax: v.salary_max,
      salaryType: v.salary_type,
      experienceLevel: v.experience_level,
      experienceYears: v.experience_years,
      skills: v.skills || [],
      status: v.status,
      applicationDeadline: v.application_deadline,
      vacanciesCount: v.vacancies_count,
      urgent: v.urgent,
      employerId: v.employer_id.toString(),
      applicationCount: parseInt(v.application_count) || 0,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    }));

    res.json(vacancies);
  } catch (error) {
    console.error('Get vacancies error:', error);
    res.status(500).json({ error: 'Failed to fetch vacancies' });
  }
});

// Get vacancy by ID
router.get('/:id', async (req, res) => {
  try {
    const vacancyId = parseInt(req.params.id);

    const result = await pool.query(
      `SELECT v.*, u.first_name, u.last_name, u.email as employer_email
       FROM vacancies v
       LEFT JOIN users u ON v.employer_id = u.id
       WHERE v.id = $1`,
      [vacancyId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    const v = result.rows[0];
    const vacancy = {
      id: v.id.toString(),
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities,
      benefits: v.benefits,
      category: v.category,
      workType: v.work_type,
      remoteWork: v.remote_work,
      salaryMin: v.salary_min,
      salaryMax: v.salary_max,
      salaryType: v.salary_type,
      experienceLevel: v.experience_level,
      experienceYears: v.experience_years,
      skills: v.skills || [],
      status: v.status,
      applicationDeadline: v.application_deadline,
      vacanciesCount: v.vacancies_count,
      urgent: v.urgent,
      employerId: v.employer_id.toString(),
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    };

    res.json(vacancy);
  } catch (error) {
    console.error('Get vacancy error:', error);
    res.status(500).json({ error: 'Failed to fetch vacancy' });
  }
});

// Create vacancy (employer only)
router.post('/', authenticateToken, requireRole('employer', 'admin'), async (req: AuthRequest, res) => {
  try {
    const validatedData = createVacancySchema.parse(req.body);
    const employerId = req.user?.id;

    if (!employerId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const result = await pool.query(
      `INSERT INTO vacancies (
        employer_id, title, company, location, description, requirements,
        responsibilities, benefits, category, work_type, remote_work,
        salary_min, salary_max, salary_type, experience_level, experience_years,
        skills, application_deadline, vacancies_count, urgent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        employerId,
        validatedData.title,
        validatedData.company,
        validatedData.location,
        validatedData.description,
        validatedData.requirements || null,
        validatedData.responsibilities || null,
        validatedData.benefits || null,
        validatedData.category || null,
        validatedData.workType,
        validatedData.remoteWork || false,
        validatedData.salaryMin || null,
        validatedData.salaryMax || null,
        validatedData.salaryType || null,
        validatedData.experienceLevel || null,
        validatedData.experienceYears || null,
        validatedData.skills || [],
        validatedData.applicationDeadline || null,
        validatedData.vacanciesCount || 1,
        validatedData.urgent || false,
      ]
    );

    const v = result.rows[0];
    const vacancy = {
      id: v.id.toString(),
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities,
      benefits: v.benefits,
      category: v.category,
      workType: v.work_type,
      remoteWork: v.remote_work,
      salaryMin: v.salary_min,
      salaryMax: v.salary_max,
      salaryType: v.salary_type,
      experienceLevel: v.experience_level,
      experienceYears: v.experience_years,
      skills: v.skills || [],
      status: v.status,
      applicationDeadline: v.application_deadline,
      vacanciesCount: v.vacancies_count,
      urgent: v.urgent,
      employerId: v.employer_id.toString(),
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    };

    res.status(201).json(vacancy);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create vacancy error:', error);
    res.status(500).json({ error: 'Failed to create vacancy' });
  }
});

// Update vacancy
router.put('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const vacancyId = parseInt(req.params.id);
    const currentUser = req.user;

    // Check if vacancy exists and user owns it
    const existingResult = await pool.query(
      'SELECT employer_id FROM vacancies WHERE id = $1',
      [vacancyId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    const vacancy = existingResult.rows[0];
    if (currentUser?.role !== 'admin' && currentUser?.id !== vacancy.employer_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      title, company, location, description, requirements, responsibilities,
      benefits, category, workType, remoteWork, salaryMin, salaryMax,
      salaryType, experienceLevel, experienceYears, skills, status,
      applicationDeadline, vacanciesCount, urgent
    } = req.body;

    const updateResult = await pool.query(
      `UPDATE vacancies SET
        title = COALESCE($1, title),
        company = COALESCE($2, company),
        location = COALESCE($3, location),
        description = COALESCE($4, description),
        requirements = COALESCE($5, requirements),
        responsibilities = COALESCE($6, responsibilities),
        benefits = COALESCE($7, benefits),
        category = COALESCE($8, category),
        work_type = COALESCE($9, work_type),
        remote_work = COALESCE($10, remote_work),
        salary_min = COALESCE($11, salary_min),
        salary_max = COALESCE($12, salary_max),
        salary_type = COALESCE($13, salary_type),
        experience_level = COALESCE($14, experience_level),
        experience_years = COALESCE($15, experience_years),
        skills = COALESCE($16, skills),
        status = COALESCE($17, status),
        application_deadline = COALESCE($18, application_deadline),
        vacancies_count = COALESCE($19, vacancies_count),
        urgent = COALESCE($20, urgent)
      WHERE id = $21
      RETURNING *`,
      [
        title, company, location, description, requirements, responsibilities,
        benefits, category, workType, remoteWork, salaryMin, salaryMax,
        salaryType, experienceLevel, experienceYears, skills, status,
        applicationDeadline, vacanciesCount, urgent, vacancyId
      ]
    );

    const v = updateResult.rows[0];
    const updatedVacancy = {
      id: v.id.toString(),
      title: v.title,
      company: v.company,
      location: v.location,
      description: v.description,
      requirements: v.requirements,
      responsibilities: v.responsibilities,
      benefits: v.benefits,
      category: v.category,
      workType: v.work_type,
      remoteWork: v.remote_work,
      salaryMin: v.salary_min,
      salaryMax: v.salary_max,
      salaryType: v.salary_type,
      experienceLevel: v.experience_level,
      experienceYears: v.experience_years,
      skills: v.skills || [],
      status: v.status,
      applicationDeadline: v.application_deadline,
      vacanciesCount: v.vacancies_count,
      urgent: v.urgent,
      employerId: v.employer_id.toString(),
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    };

    res.json(updatedVacancy);
  } catch (error) {
    console.error('Update vacancy error:', error);
    res.status(500).json({ error: 'Failed to update vacancy' });
  }
});

// Delete vacancy
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const vacancyId = parseInt(req.params.id);
    const currentUser = req.user;

    // Check if vacancy exists and user owns it
    const existingResult = await pool.query(
      'SELECT employer_id FROM vacancies WHERE id = $1',
      [vacancyId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    const vacancy = existingResult.rows[0];
    if (currentUser?.role !== 'admin' && currentUser?.id !== vacancy.employer_id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await pool.query('DELETE FROM vacancies WHERE id = $1', [vacancyId]);

    res.json({ message: 'Vacancy deleted successfully' });
  } catch (error) {
    console.error('Delete vacancy error:', error);
    res.status(500).json({ error: 'Failed to delete vacancy' });
  }
});

export default router;

