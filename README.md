# SmartHR - Full Stack Job Portal Application

A comprehensive job portal application with AI-powered features for employers and job seekers.

## Features

### For Job Seekers
- Resume Generator with AI assistance
- CV Analyzer
- Job Matching Algorithm
- Application Tracking
- Interview Simulator
- Profile Management

### For Employers
- Create and manage job vacancies
- AI-powered job description generation
- View and manage applicants
- Application status management

### For Admins
- User management
- System-wide vacancy management
- Analytics and reporting

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/UI components
- Zustand (state management)
- React Router
- Axios
- Google Gemini AI

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT Authentication
- Bcrypt (password hashing)
- Zod (validation)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd shb
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create a .env file (copy from .env.example)
cp .env.example .env

# Edit .env file with your configuration:
# - Database credentials
# - JWT secret
# - Gemini API key (optional, for AI features)
```

**Configure your `.env` file:**

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=shb_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

GEMINI_API_KEY=your_gemini_api_key_here

CORS_ORIGIN=http://localhost:8080
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb shb_db

# Or using psql:
psql -U postgres
CREATE DATABASE shb_db;
\q

# Run migrations to create tables
npm run db:migrate

# Seed database with initial data (optional)
npm run db:seed
```

### 4. Start Backend Server

```bash
# Development mode (with hot reload)
npm run dev

# Or build and run in production mode
npm run build
npm start
```

The backend API will be available at `http://localhost:3001`

### 5. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Create a .env file
cp .env.example .env

# Edit .env file:
VITE_API_URL=http://localhost:3001/api
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 6. Start Frontend Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:8080`

## Default Test Accounts

After running `npm run db:seed` in the server directory, you can use these accounts:

### Admin
- Email: `admin@test.com`
- Password: `admin123`

### Employer
- Email: `employer@test.com`
- Password: `employer123`

### Job Seeker
- Email: `jobseeker@test.com`
- Password: `jobseeker123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Vacancies
- `GET /api/vacancies` - Get all vacancies (public)
- `GET /api/vacancies/:id` - Get vacancy by ID
- `POST /api/vacancies` - Create vacancy (employer/admin)
- `PUT /api/vacancies/:id` - Update vacancy
- `DELETE /api/vacancies/:id` - Delete vacancy

### Applications
- `GET /api/applications` - Get applications (filtered by role)
- `POST /api/applications` - Create application (job seeker)
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

### Jobs
- `GET /api/jobs/matches` - Get job matches for job seeker
- `POST /api/jobs/:id/save` - Save job
- `DELETE /api/jobs/:id/save` - Unsave job
- `GET /api/jobs/saved` - Get saved jobs

### Resumes
- `GET /api/resumes` - Get current user's resume
- `POST /api/resumes` - Create or update resume
- `PUT /api/resumes` - Update resume

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## Project Structure

```
shb/
├── server/                 # Backend code
│   ├── src/
│   │   ├── db/            # Database configuration and migrations
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API route handlers
│   │   └── index.ts       # Server entry point
│   └── package.json
├── src/                    # Frontend code
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── services/          # API service functions
│   ├── store/             # State management
│   ├── lib/               # Utilities and configurations
│   └── types/             # TypeScript types
└── package.json
```

## Development

### Backend Development
- Watch mode: `npm run dev` (uses tsx for hot reload)
- Build: `npm run build`
- Start: `npm start`

### Frontend Development
- Dev server: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`

## Environment Variables

### Backend (.env in server/)
- `PORT` - Server port (default: 3001)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration time
- `GEMINI_API_KEY` - Google Gemini API key (for AI features)
- `CORS_ORIGIN` - Frontend URL for CORS

### Frontend (.env in root/)
- `VITE_API_URL` - Backend API URL
- `VITE_GEMINI_API_KEY` - Gemini API key (optional, for client-side AI)

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### CORS Errors
- Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL
- Check that backend server is running

### Authentication Issues
- Verify JWT_SECRET is set in backend `.env`
- Clear browser localStorage and login again
- Check token expiration settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on the repository.
