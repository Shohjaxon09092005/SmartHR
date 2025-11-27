import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const profileUpdateSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  birthDate: z.string().optional(),
  professionalTitle: z.string().optional(),
  experienceYears: z.string().optional(),
  currentCompany: z.string().optional(),
  socialLinks: z.object({
    github: z.string().optional(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
  settings: z.object({
    emailNotifications: z.boolean().optional(),
    jobAlerts: z.boolean().optional(),
    twoFactorAuth: z.boolean().optional(),
    privacy: z.string().optional(),
  }).optional(),
});

const educationSchema = z.object({
  degree: z.string().min(1),
  institution: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const experienceSchema = z.object({
  position: z.string().min(1),
  company: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const portfolioSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  link: z.string().optional(),
  technologies: z.array(z.string()).optional(),
});

// Get full profile
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = currentUser.id;

    // Get user basic info
    const userResult = await pool.query(
      `SELECT id, email, first_name, last_name, phone, role, avatar, created_at
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Get profile info - create if it doesn't exist
    let profileResult = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [userId]
    );

    let profile = profileResult.rows[0] || null;

    // If profile doesn't exist, create an empty one
    if (!profile) {
      const newProfileResult = await pool.query(
        `INSERT INTO user_profiles (user_id, social_links, settings)
         VALUES ($1, '{}', '{"emailNotifications": true, "jobAlerts": true, "twoFactorAuth": false, "privacy": "public"}')
         RETURNING *`,
        [userId]
      );
      profile = newProfileResult.rows[0];
    }

    // Get education
    const educationResult = await pool.query(
      'SELECT * FROM user_education WHERE user_id = $1 ORDER BY end_date DESC NULLS LAST, start_date DESC',
      [userId]
    );

    // Get experience
    const experienceResult = await pool.query(
      'SELECT * FROM user_experience WHERE user_id = $1 ORDER BY end_date DESC NULLS LAST, start_date DESC',
      [userId]
    );

    // Get portfolio
    const portfolioResult = await pool.query(
      'SELECT * FROM user_portfolio WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // Get resume if jobseeker
    let resume = null;
    if (currentUser.role === 'jobseeker') {
      const resumeResult = await pool.query(
        'SELECT * FROM resumes WHERE user_id = $1',
        [userId]
      );
      if (resumeResult.rows.length > 0) {
        const r = resumeResult.rows[0];
        resume = {
          id: r.id.toString(),
          content: r.content,
          skills: r.skills || [],
          experience: r.experience,
          education: r.education,
          resumeScore: 85, // Can be calculated based on completeness
        };
      }
    }

    // Get application count for jobseeker
    let applicationCount = 0;
    if (currentUser.role === 'jobseeker') {
      const appCountResult = await pool.query(
        'SELECT COUNT(*) as count FROM applications WHERE job_seeker_id = $1',
        [userId]
      );
      applicationCount = parseInt(appCountResult.rows[0].count) || 0;
    }

    res.json({
      personal: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone || '',
        location: profile?.location || '',
        birthDate: profile?.birth_date ? new Date(profile.birth_date).toISOString().split('T')[0] : '',
        bio: profile?.bio || '',
        avatar: user.avatar || '/api/placeholder/120/120',
      },
      professional: {
        title: profile?.professional_title || '',
        experience: profile?.experience_years || '',
        currentCompany: profile?.current_company || '',
        skills: resume?.skills?.map((skill: string) => ({ name: skill, level: 70 })) || [],
        resume: resume?.content || '',
        resumeScore: resume?.resumeScore || 0,
      },
      education: educationResult.rows.map((edu) => ({
        id: edu.id.toString(),
        degree: edu.degree,
        institution: edu.institution,
        period: edu.start_date && edu.end_date
          ? `${new Date(edu.start_date).getFullYear()} - ${new Date(edu.end_date).getFullYear()}`
          : edu.start_date
          ? `${new Date(edu.start_date).getFullYear()} - Hozirgacha`
          : '',
        description: edu.description || '',
        startDate: edu.start_date ? new Date(edu.start_date).toISOString().split('T')[0] : '',
        endDate: edu.end_date ? new Date(edu.end_date).toISOString().split('T')[0] : '',
      })),
      experience: experienceResult.rows.map((exp) => ({
        id: exp.id.toString(),
        position: exp.position,
        company: exp.company,
        period: exp.start_date && exp.end_date
          ? `${new Date(exp.start_date).getFullYear()} - ${new Date(exp.end_date).getFullYear()}`
          : exp.start_date
          ? `${new Date(exp.start_date).getFullYear()} - Hozirgacha`
          : '',
        description: exp.description || '',
        startDate: exp.start_date ? new Date(exp.start_date).toISOString().split('T')[0] : '',
        endDate: exp.end_date ? new Date(exp.end_date).toISOString().split('T')[0] : '',
      })),
      portfolio: portfolioResult.rows.map((proj) => ({
        id: proj.id.toString(),
        title: proj.title,
        description: proj.description || '',
        link: proj.link || '',
        technologies: proj.technologies || [],
      })),
      social: (typeof profile?.social_links === 'object' && profile?.social_links !== null 
        ? profile.social_links 
        : typeof profile?.social_links === 'string' 
        ? JSON.parse(profile.social_links) 
        : {
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
          }) || {
        github: '',
        linkedin: '',
        twitter: '',
        website: '',
      },
      settings: (typeof profile?.settings === 'object' && profile?.settings !== null 
        ? profile.settings 
        : typeof profile?.settings === 'string' 
        ? JSON.parse(profile.settings) 
        : {
            emailNotifications: true,
            jobAlerts: true,
            twoFactorAuth: false,
            privacy: 'public',
          }) || {
        emailNotifications: true,
        jobAlerts: true,
        twoFactorAuth: false,
        privacy: 'public',
      },
      stats: {
        profileViews: 1234, // Can be tracked later
        applications: applicationCount,
        interviews: 12, // Can be calculated from applications
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = currentUser.id;
    const validatedData = profileUpdateSchema.parse(req.body);

    // Update user basic info if provided
    if (validatedData.firstName || validatedData.lastName || validatedData.phone) {
      const userUpdates: string[] = [];
      const userValues: any[] = [];
      let userParamCount = 1;

      if (validatedData.firstName) {
        userUpdates.push(`first_name = $${userParamCount++}`);
        userValues.push(validatedData.firstName);
      }
      if (validatedData.lastName) {
        userUpdates.push(`last_name = $${userParamCount++}`);
        userValues.push(validatedData.lastName);
      }
      if (validatedData.phone !== undefined) {
        userUpdates.push(`phone = $${userParamCount++}`);
        userValues.push(validatedData.phone || null);
      }

      userValues.push(userId);
      await pool.query(
        `UPDATE users SET ${userUpdates.join(', ')} WHERE id = $${userParamCount}`,
        userValues
      );
    }

    // Update or create profile
    const profileResult = await pool.query(
      `INSERT INTO user_profiles (
        user_id, bio, location, birth_date, professional_title, 
        experience_years, current_company, social_links, settings
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb)
      ON CONFLICT (user_id)
      DO UPDATE SET
        bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
        location = COALESCE(EXCLUDED.location, user_profiles.location),
        birth_date = COALESCE(EXCLUDED.birth_date, user_profiles.birth_date),
        professional_title = COALESCE(EXCLUDED.professional_title, user_profiles.professional_title),
        experience_years = COALESCE(EXCLUDED.experience_years, user_profiles.experience_years),
        current_company = COALESCE(EXCLUDED.current_company, user_profiles.current_company),
        social_links = COALESCE(EXCLUDED.social_links, user_profiles.social_links),
        settings = COALESCE(EXCLUDED.settings, user_profiles.settings)
      RETURNING *`,
      [
        userId,
        validatedData.bio || null,
        validatedData.location || null,
        validatedData.birthDate ? new Date(validatedData.birthDate).toISOString().split('T')[0] : null,
        validatedData.professionalTitle || null,
        validatedData.experienceYears || null,
        validatedData.currentCompany || null,
        validatedData.socialLinks ? JSON.stringify(validatedData.socialLinks) : '{}',
        validatedData.settings ? JSON.stringify(validatedData.settings) : '{}',
      ]
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Education endpoints
router.post('/education', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const validatedData = educationSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO user_education (user_id, degree, institution, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        currentUser.id,
        validatedData.degree,
        validatedData.institution,
        validatedData.startDate ? new Date(validatedData.startDate).toISOString().split('T')[0] : null,
        validatedData.endDate ? new Date(validatedData.endDate).toISOString().split('T')[0] : null,
        validatedData.description || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id.toString(), ...validatedData });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Add education error:', error);
    res.status(500).json({ error: 'Failed to add education' });
  }
});

router.delete('/education/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const result = await pool.query(
      'DELETE FROM user_education WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, currentUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Education not found' });
    }

    res.json({ message: 'Education deleted successfully' });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ error: 'Failed to delete education' });
  }
});

// Experience endpoints
router.post('/experience', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const validatedData = experienceSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO user_experience (user_id, position, company, start_date, end_date, description)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        currentUser.id,
        validatedData.position,
        validatedData.company,
        validatedData.startDate ? new Date(validatedData.startDate).toISOString().split('T')[0] : null,
        validatedData.endDate ? new Date(validatedData.endDate).toISOString().split('T')[0] : null,
        validatedData.description || null,
      ]
    );

    res.status(201).json({ id: result.rows[0].id.toString(), ...validatedData });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Add experience error:', error);
    res.status(500).json({ error: 'Failed to add experience' });
  }
});

router.delete('/experience/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const result = await pool.query(
      'DELETE FROM user_experience WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, currentUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Delete experience error:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

// Portfolio endpoints
router.post('/portfolio', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const validatedData = portfolioSchema.parse(req.body);

    const result = await pool.query(
      `INSERT INTO user_portfolio (user_id, title, description, link, technologies)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        currentUser.id,
        validatedData.title,
        validatedData.description || null,
        validatedData.link || null,
        validatedData.technologies || [],
      ]
    );

    res.status(201).json({ id: result.rows[0].id.toString(), ...validatedData });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Add portfolio error:', error);
    res.status(500).json({ error: 'Failed to add portfolio' });
  }
});

router.delete('/portfolio/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) return res.status(401).json({ error: 'Authentication required' });

    const result = await pool.query(
      'DELETE FROM user_portfolio WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, currentUser.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Delete portfolio error:', error);
    res.status(500).json({ error: 'Failed to delete portfolio item' });
  }
});

export default router;

