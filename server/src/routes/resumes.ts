import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const resumeSchema = z.object({
  content: z.string().min(1),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
});

// Get user's resume
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only job seekers should have resumes
    if (currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can have resumes' });
    }

    const result = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [currentUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const resume = result.rows[0];
    res.json({
      id: resume.id.toString(),
      userId: resume.user_id.toString(),
      content: resume.content,
      skills: resume.skills || [],
      experience: resume.experience,
      education: resume.education,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at,
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Create or update resume
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can create resumes' });
    }

    const validatedData = resumeSchema.parse(req.body);
    const { content, skills, experience, education } = validatedData;

    // Check if resume exists
    const existingResult = await pool.query(
      'SELECT id FROM resumes WHERE user_id = $1',
      [currentUser.id]
    );

    let result;
    if (existingResult.rows.length > 0) {
      // Update existing resume
      result = await pool.query(
        `UPDATE resumes
         SET content = $1, skills = $2, experience = $3, education = $4
         WHERE user_id = $5
         RETURNING *`,
        [content, skills || [], experience || null, education || null, currentUser.id]
      );
    } else {
      // Create new resume
      result = await pool.query(
        `INSERT INTO resumes (user_id, content, skills, experience, education)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [currentUser.id, content, skills || [], experience || null, education || null]
      );
    }

    const resume = result.rows[0];
    res.status(existingResult.rows.length > 0 ? 200 : 201).json({
      id: resume.id.toString(),
      userId: resume.user_id.toString(),
      content: resume.content,
      skills: resume.skills || [],
      experience: resume.experience,
      education: resume.education,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create/update resume error:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Update resume
router.put('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can update resumes' });
    }

    const { content, skills, experience, education } = req.body;

    const result = await pool.query(
      `UPDATE resumes
       SET content = COALESCE($1, content),
           skills = COALESCE($2, skills),
           experience = COALESCE($3, experience),
           education = COALESCE($4, education)
       WHERE user_id = $5
       RETURNING *`,
      [content, skills, experience, education, currentUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    const resume = result.rows[0];
    res.json({
      id: resume.id.toString(),
      userId: resume.user_id.toString(),
      content: resume.content,
      skills: resume.skills || [],
      experience: resume.experience,
      education: resume.education,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at,
    });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ error: 'Failed to update resume' });
  }
});

export default router;

