# ⚠️ Backend Server Not Running

The frontend is trying to connect to the backend API at `http://localhost:3001`, but the server is not running.

## Quick Start

### Step 1: Navigate to Server Directory
```bash
cd server
```

### Step 2: Install Dependencies (if not done)
```bash
npm install
```

### Step 3: Set Up Environment
```bash
# Copy the example env file
cp .env.example .env

# Edit .env file with your database credentials
# At minimum, update:
# - DB_PASSWORD (your PostgreSQL password)
# - JWT_SECRET (any random string for security)
```

### Step 4: Set Up Database

**Option A: Using createdb command (recommended)**
```bash
createdb shb_db
```

**Option B: Using psql**
```bash
psql -U postgres
CREATE DATABASE shb_db;
\q
```

### Step 5: Run Database Migrations
```bash
npm run db:migrate
```

### Step 6: (Optional) Seed Test Data
```bash
npm run db:seed
```

This will create test accounts:
- Admin: `admin@test.com` / `admin123`
- Employer: `employer@test.com` / `employer123`
- Job Seeker: `jobseeker@test.com` / `jobseeker123`

### Step 7: Start the Backend Server
```bash
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:3001
```

## Troubleshooting

### Database Connection Error
- **Check PostgreSQL is running:**
  ```bash
  # Windows (if installed as service, should be running)
  # Check in Services
  
  # Or try connecting:
  psql -U postgres -d postgres
  ```

- **Verify database exists:**
  ```bash
  psql -U postgres -l | grep shb_db
  ```

- **Check credentials in `server/.env`:**
  ```
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=shb_db
  DB_USER=postgres
  DB_PASSWORD=your_password_here
  ```

### Port Already in Use
If port 3001 is already in use:
1. Change `PORT` in `server/.env` to a different port (e.g., `3002`)
2. Update `VITE_API_URL` in root `.env` to match

### Dependencies Not Installed
If you get "command not found" errors:
```bash
cd server
npm install
```

## After Starting Backend

Once the backend is running, refresh your browser. The frontend will automatically connect to the API.

## Need More Help?

See the main `README.md` or `SETUP.md` for detailed instructions.

