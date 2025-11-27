import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool } from './db/connection';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vacancyRoutes from './routes/vacancies';
import applicationRoutes from './routes/applications';
import resumeRoutes from './routes/resumes';
import jobRoutes from './routes/jobs';
import profileRoutes from './routes/profile';
import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SmartHR API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/vacancies', vacancyRoutes);
app.use('/api/applications', authenticateToken, applicationRoutes);
app.use('/api/resumes', authenticateToken, resumeRoutes);
app.use('/api/jobs', authenticateToken, jobRoutes);
app.use('/api/profile', authenticateToken, profileRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    client.release();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

