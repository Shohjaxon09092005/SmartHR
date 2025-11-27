# Quick Setup Guide

## Step-by-Step Setup Instructions

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your PostgreSQL credentials
# Make sure to change:
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (generate a strong random string)
# - GEMINI_API_KEY (optional, for AI features)
```

### 2. Database Setup

```bash
# Option 1: Using createdb command (recommended)
createdb shb_db

# Option 2: Using psql
psql -U postgres
CREATE DATABASE shb_db;
\q

# Run migrations to create tables
cd server
npm run db:migrate

# Seed database with test accounts (optional)
npm run db:seed
```

### 3. Start Backend Server

```bash
cd server
npm run dev
```

The backend should start on `http://localhost:3001`

### 4. Frontend Setup

```bash
# From project root
npm install

# Create .env file (if not exists)
# Add: VITE_API_URL=http://localhost:3001/api

# Start frontend
npm run dev
```

The frontend should start on `http://localhost:8080`

## Test Accounts (after seeding)

- **Admin**: admin@test.com / admin123
- **Employer**: employer@test.com / employer123
- **Job Seeker**: jobseeker@test.com / jobseeker123

## Common Issues

### Database Connection Error
- Check PostgreSQL is running: `pg_isready`
- Verify credentials in `server/.env`
- Ensure database exists: `psql -U postgres -l | grep shb_db`

### CORS Errors
- Verify `CORS_ORIGIN` in `server/.env` matches frontend URL
- Default should be: `http://localhost:8080`

### Port Already in Use
- Backend: Change `PORT` in `server/.env`
- Frontend: Change port in `vite.config.ts`

## Next Steps

1. Register a new user or login with test account
2. Create a vacancy (as employer)
3. Browse job matches (as job seeker)
4. Apply to jobs and track applications

## Need Help?

Check the main `README.md` for detailed documentation.

