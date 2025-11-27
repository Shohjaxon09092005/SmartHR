import express from 'express';
import { pool } from '../db/connection';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCpTyhVz0GL9x-mOYPUFpHa936fZr2tbeo";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// AI function to analyze and match
async function callGeminiAPI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// AI-powered job matching for job seekers
router.post('/find-jobs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'jobseeker') {
      return res.status(403).json({ error: 'Only job seekers can find jobs' });
    }

    // Get user profile and resume
    const userResult = await pool.query(
      `SELECT u.first_name, u.last_name, u.email, up.*
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       WHERE u.id = $1`,
      [currentUser.id]
    );

    const resumeResult = await pool.query(
      'SELECT * FROM resumes WHERE user_id = $1',
      [currentUser.id]
    );

    const user = userResult.rows[0];
    const resume = resumeResult.rows[0];

    if (!resume) {
      return res.status(400).json({ error: 'Resume not found. Please create a resume first.' });
    }

    // Get all active vacancies
    const vacanciesResult = await pool.query(
      `SELECT v.*, u.first_name as employer_first_name, u.last_name as employer_last_name
       FROM vacancies v
       LEFT JOIN users u ON v.employer_id = u.id
       WHERE v.status = 'active'
       ORDER BY v.created_at DESC`
    );

    // Prepare user profile data for AI
    const userProfile = {
      name: `${user.first_name} ${user.last_name}`,
      skills: resume.skills || [],
      experience: resume.experience || '',
      education: resume.education || '',
      professionalTitle: user.professional_title || '',
      bio: user.bio || '',
    };

    // Create AI prompt for matching
    const prompt = `Siz professional HR konsultantsiz. Quyidagi nomzod profiliga mos keladigan ish o'rinlarini topish va baholash vazifasida:

NOMZOD PROFILI:
Ism: ${userProfile.name}
Professional unvon: ${userProfile.professionalTitle}
Ko'nikmalar: ${userProfile.skills.join(', ')}
Tajriba: ${userProfile.experience}
Ta'lim: ${userProfile.education}
Bio: ${userProfile.bio}

MEVCUD VAKANSIYALAR:
${vacanciesResult.rows.map((v, idx) => `
${idx + 1}. [ID: ${v.id}] ${v.title} - ${v.company}
   Talab qilinadigan ko'nikmalar: ${(v.skills || []).join(', ')}
   Tajriba: ${v.experience_years || 'Ko\'rsatilmagan'}
   Manzil: ${v.location}
   Tavsif: ${v.description.substring(0, 200)}...
`).join('\n')}

TALAB:
Har bir vakansiya uchun nomzodning mosligini 0-100 ball sifatida baholang va quyidagi JSON formatda javob bering.
ID ni ishlatib vakansiyalarni identifikatsiya qiling:

{
  "matches": [
    {
      "vacancyId": 1,
      "matchScore": 85,
      "reason": "Ko'nikmalar 90% mos keladi, tajriba darajasi mos"
    },
    ...
  ]
}

FAQRAT JSON QAYTARING, BOSHQA MATN QO'SHMANG.`;

    // Call AI for matching
    let aiResponse;
    try {
      aiResponse = await callGeminiAPI(prompt);
      
      // Extract JSON from response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI javobida JSON topilmadi");
      }

      const aiMatches = JSON.parse(jsonMatch[0]);
      
      // Apply AI scores to vacancies - map by index (AI returns 1-based index)
      const aiMatchMap = new Map<number, { score: number; reason: string }>();
      if (Array.isArray(aiMatches.matches)) {
        aiMatches.matches.forEach((m: any) => {
          const index = m.vacancyId - 1; // Convert to 0-based index
          if (index >= 0 && index < vacanciesResult.rows.length) {
            const vacancyId = vacanciesResult.rows[index].id;
            aiMatchMap.set(vacancyId, { score: m.matchScore, reason: m.reason });
          }
        });
      }

      // Calculate enhanced match scores with AI
      const enhancedMatches = vacanciesResult.rows.map(v => {
        const vacancySkills = v.skills || [];
        const resumeSkills = resume.skills || [];
        
        // Basic skill matching
        let basicScore = 50;
        if (vacancySkills.length > 0 && resumeSkills.length > 0) {
          const matchedSkills = vacancySkills.filter((skill: string) =>
            resumeSkills.some((rs: string) =>
              rs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(rs.toLowerCase())
            )
          );
          basicScore = Math.round((matchedSkills.length / vacancySkills.length) * 100);
        }

        // Use AI score if available, otherwise use basic score
        const aiMatch = aiMatchMap.get(v.id);
        const finalScore = aiMatch ? aiMatch.score : basicScore;

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
          matchScore: Math.max(0, Math.min(100, finalScore)),
          matchReason: aiMatch?.reason || "Ko'nikmalar mos keladi",
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

      // Add status
      const matchesWithStatus = enhancedMatches.map(match => ({
        ...match,
        alreadyApplied: appliedVacancyIds.has(match.id),
        isSaved: savedVacancyIds.has(match.id),
      }));

      // Sort by match score descending
      matchesWithStatus.sort((a, b) => b.matchScore - a.matchScore);

      res.json(matchesWithStatus);
    } catch (aiError) {
      console.error('AI matching error, using basic matching:', aiError);
      // Fallback to basic matching if AI fails
      const basicMatches = vacanciesResult.rows.map(v => {
        const vacancySkills = v.skills || [];
        const resumeSkills = resume.skills || [];
        let matchScore = 50;
        let matchedSkillsCount = 0;

        if (vacancySkills.length > 0 && resumeSkills.length > 0) {
          const matchedSkills = vacancySkills.filter((skill: string) =>
            resumeSkills.some((rs: string) =>
              rs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(rs.toLowerCase())
            )
          );
          matchedSkillsCount = matchedSkills.length;
          matchScore = Math.round((matchedSkills.length / vacancySkills.length) * 100);
        }

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
          matchReason: `${matchedSkillsCount} ta ko'nikma mos keladi`,
          createdAt: v.created_at,
        };
      });

      const applicationsResult = await pool.query(
        'SELECT vacancy_id FROM applications WHERE job_seeker_id = $1',
        [currentUser.id]
      );
      const appliedVacancyIds = new Set(
        applicationsResult.rows.map(a => a.vacancy_id.toString())
      );

      const savedJobsResult = await pool.query(
        'SELECT vacancy_id FROM saved_jobs WHERE user_id = $1',
        [currentUser.id]
      );
      const savedVacancyIds = new Set(
        savedJobsResult.rows.map(s => s.vacancy_id.toString())
      );

      const matchesWithStatus = basicMatches.map(match => ({
        ...match,
        alreadyApplied: appliedVacancyIds.has(match.id),
        isSaved: savedVacancyIds.has(match.id),
      }));

      matchesWithStatus.sort((a, b) => b.matchScore - a.matchScore);
      res.json(matchesWithStatus);
    }
  } catch (error) {
    console.error('Find jobs error:', error);
    res.status(500).json({ error: 'Failed to find jobs' });
  }
});

// AI-powered candidate matching for employers
router.post('/find-candidates', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser || currentUser.role !== 'employer') {
      return res.status(403).json({ error: 'Only employers can find candidates' });
    }

    const { vacancyId } = req.body;
    if (!vacancyId) {
      return res.status(400).json({ error: 'vacancyId is required' });
    }

    // Get vacancy details
    const vacancyResult = await pool.query(
      'SELECT * FROM vacancies WHERE id = $1 AND employer_id = $2',
      [vacancyId, currentUser.id]
    );

    if (vacancyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }

    const vacancy = vacancyResult.rows[0];

    // Get all job seekers with profiles and resumes
    const candidatesResult = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, u.email, u.phone, u.avatar,
              up.bio, up.professional_title, up.location, up.experience_years,
              r.skills, r.experience, r.education, r.content as resume_content
       FROM users u
       LEFT JOIN user_profiles up ON u.id = up.user_id
       LEFT JOIN resumes r ON u.id = r.user_id
       WHERE u.role = 'jobseeker' AND r.id IS NOT NULL
       ORDER BY u.created_at DESC`
    );

    if (candidatesResult.rows.length === 0) {
      return res.json([]);
    }

    // Prepare vacancy data for AI
    const vacancyData = {
      title: vacancy.title,
      skills: vacancy.skills || [],
      experienceYears: vacancy.experience_years || '',
      description: vacancy.description,
      requirements: vacancy.requirements || '',
    };

    // Create AI prompt for candidate matching
    const prompt = `Siz professional HR konsultantsiz. Quyidagi vakansiyaga mos keladigan nomzodlarni topish va baholash vazifasida:

VAKANSIYA:
Lavozim: ${vacancyData.title}
Talab qilinadigan ko'nikmalar: ${vacancyData.skills.join(', ')}
Tajriba: ${vacancyData.experienceYears}
Tavsif: ${vacancyData.description.substring(0, 300)}
Talablar: ${vacancyData.requirements.substring(0, 300)}

NOMZODLAR:
${candidatesResult.rows.map((c, idx) => `
${idx + 1}. [ID: ${c.id}] ${c.first_name} ${c.last_name}
   Ko'nikmalar: ${(c.skills || []).join(', ')}
   Tajriba: ${c.experience || 'Ko\'rsatilmagan'}
   Ta'lim: ${c.education || 'Ko\'rsatilmagan'}
   Professional unvon: ${c.professional_title || 'Ko\'rsatilmagan'}
   Bio: ${c.bio || 'Ko\'rsatilmagan'}
   Resume: ${(c.resume_content || '').substring(0, 300)}...
`).join('\n')}

TALAB:
Har bir nomzod uchun vakansiyaga mosligini 0-100 ball sifatida baholang va quyidagi JSON formatda javob bering.
ID ni ishlatib nomzodlarni identifikatsiya qiling:

{
  "matches": [
    {
      "candidateId": 1,
      "matchScore": 85,
      "reason": "Ko'nikmalar 90% mos keladi, tajriba darajasi mos"
    },
    ...
  ]
}

FAQRAT JSON QAYTARING, BOSHQA MATN QO'SHMANG.`;

    // Call AI for matching
    let aiResponse;
    try {
      aiResponse = await callGeminiAPI(prompt);
      
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("AI javobida JSON topilmadi");
      }

      const aiMatches = JSON.parse(jsonMatch[0]);
      // Apply AI scores to candidates - map by index (AI returns 1-based index)
      const aiMatchMap = new Map<number, { score: number; reason: string }>();
      if (Array.isArray(aiMatches.matches)) {
        aiMatches.matches.forEach((m: any) => {
          const index = m.candidateId - 1; // Convert to 0-based index
          if (index >= 0 && index < candidatesResult.rows.length) {
            const candidateId = candidatesResult.rows[index].id;
            aiMatchMap.set(candidateId, { score: m.matchScore, reason: m.reason });
          }
        });
      }

      // Calculate enhanced match scores
      const enhancedCandidates = candidatesResult.rows.map(c => {
        const candidateSkills = c.skills || [];
        const vacancySkills = vacancy.skills || [];
        
        // Basic skill matching
        let basicScore = 50;
        if (vacancySkills.length > 0 && candidateSkills.length > 0) {
          const matchedSkills = vacancySkills.filter((skill: string) =>
            candidateSkills.some((cs: string) =>
              cs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(cs.toLowerCase())
            )
          );
          basicScore = Math.round((matchedSkills.length / vacancySkills.length) * 100);
        }

        // Use AI score if available
        const aiMatch = aiMatchMap.get(c.id);
        const finalScore = aiMatch ? aiMatch.score : basicScore;

        // Check if already applied
        return {
          id: c.id.toString(),
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar,
          bio: c.bio,
          professionalTitle: c.professional_title,
          location: c.location,
          experienceYears: c.experience_years,
          skills: c.skills || [],
          experience: c.experience,
          education: c.education,
          resumeContent: c.resume_content,
          matchScore: Math.max(0, Math.min(100, finalScore)),
          matchReason: aiMatch?.reason || "Ko'nikmalar mos keladi",
        };
      });

      // Check application status
      const applicationsResult = await pool.query(
        'SELECT job_seeker_id, status FROM applications WHERE vacancy_id = $1',
        [vacancyId]
      );
      const applicationMap = new Map(
        applicationsResult.rows.map(a => [a.job_seeker_id.toString(), a.status])
      );

      const candidatesWithStatus = enhancedCandidates.map(candidate => ({
        ...candidate,
        applicationStatus: applicationMap.get(candidate.id) || null,
        hasApplied: applicationMap.has(candidate.id),
      }));

      // Sort by match score descending
      candidatesWithStatus.sort((a, b) => b.matchScore - a.matchScore);

      res.json(candidatesWithStatus);
    } catch (aiError) {
      console.error('AI matching error, using basic matching:', aiError);
      // Fallback to basic matching
      const basicCandidates = candidatesResult.rows.map(c => {
        const candidateSkills = c.skills || [];
        const vacancySkills = vacancy.skills || [];
        let matchScore = 50;

        if (vacancySkills.length > 0 && candidateSkills.length > 0) {
          const matchedSkills = vacancySkills.filter((skill: string) =>
            candidateSkills.some((cs: string) =>
              cs.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(cs.toLowerCase())
            )
          );
          matchScore = Math.round((matchedSkills.length / vacancySkills.length) * 100);
        }

        return {
          id: c.id.toString(),
          firstName: c.first_name,
          lastName: c.last_name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar,
          bio: c.bio,
          professionalTitle: c.professional_title,
          location: c.location,
          experienceYears: c.experience_years,
          skills: c.skills || [],
          experience: c.experience,
          education: c.education,
          resumeContent: c.resume_content,
          matchScore,
          matchReason: `Ko'nikmalar mos keladi`,
        };
      });

      const applicationsResult = await pool.query(
        'SELECT job_seeker_id, status FROM applications WHERE vacancy_id = $1',
        [vacancyId]
      );
      const applicationMap = new Map(
        applicationsResult.rows.map(a => [a.job_seeker_id.toString(), a.status])
      );

      const candidatesWithStatus = basicCandidates.map(candidate => ({
        ...candidate,
        applicationStatus: applicationMap.get(candidate.id) || null,
        hasApplied: applicationMap.has(candidate.id),
      }));

      candidatesWithStatus.sort((a, b) => b.matchScore - a.matchScore);
      res.json(candidatesWithStatus);
    }
  } catch (error) {
    console.error('Find candidates error:', error);
    res.status(500).json({ error: 'Failed to find candidates' });
  }
});

export default router;

