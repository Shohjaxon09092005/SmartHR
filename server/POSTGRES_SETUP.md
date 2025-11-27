# PostgreSQL Setup Guide

## Current Error
```
password authentication failed for user "postgres"
```

This means the PostgreSQL password in your `.env` file doesn't match your actual PostgreSQL password.

## Solution Options

### Option 1: Find/Use Your Existing PostgreSQL Password

1. **Check if you know your PostgreSQL password:**
   - Try connecting with psql: `psql -U postgres`
   - If it prompts for a password, enter what you think it is

2. **If you don't remember the password, continue to Option 2**

### Option 2: Reset PostgreSQL Password (Windows)

1. **Stop PostgreSQL service:**
   - Open Services (Win + R, type `services.msc`)
   - Find "postgresql-x64-XX" service
   - Right-click → Stop

2. **Edit pg_hba.conf file:**
   - Navigate to PostgreSQL data directory (usually `C:\Program Files\PostgreSQL\XX\data\`)
   - Open `pg_hba.conf` in a text editor (as Administrator)
   - Find the line starting with:
     ```
     # IPv4 local connections:
     host    all             all             127.0.0.1/32            scram-sha-256
     ```
   - Change `scram-sha-256` to `trust`:
     ```
     host    all             all             127.0.0.1/32            trust
     ```
   - Save the file

3. **Start PostgreSQL service:**
   - Go back to Services
   - Start the postgresql service

4. **Connect and reset password:**
   ```bash
   psql -U postgres
   ```
   (No password needed now)

5. **In psql, run:**
   ```sql
   ALTER USER postgres PASSWORD 'your_new_password';
   \q
   ```

6. **Revert pg_hba.conf:**
   - Change `trust` back to `scram-sha-256`
   - Restart PostgreSQL service

### Option 3: Use a Different PostgreSQL User

If you have another PostgreSQL user with a password you know:

1. Create `.env` file in `server/` directory
2. Use that user's credentials instead

### Option 4: Set Environment Variables Directly

Instead of using `.env`, you can set environment variables in your terminal before running:

**PowerShell:**
```powershell
$env:DB_PASSWORD="your_password"
$env:JWT_SECRET="your_secret_key"
npm run dev
```

**Command Prompt:**
```cmd
set DB_PASSWORD=your_password
set JWT_SECRET=your_secret_key
npm run dev
```

## Create .env File

Once you have your PostgreSQL password, create `server/.env` file with:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shb_db
DB_USER=postgres
DB_PASSWORD=your_actual_postgres_password_here

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Gemini AI Configuration (Optional)
GEMINI_API_KEY=your_gemini_api_key_here

# CORS Configuration
CORS_ORIGIN=http://localhost:8080
```

**Important:** Replace `your_actual_postgres_password_here` with your real PostgreSQL password!

## Verify Connection

After setting up `.env`, test the connection:

```bash
cd server
npm run dev
```

You should see:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:3001
```

## Common Default Passwords

Some common default passwords people use:
- `postgres`
- `admin`
- `root`
- `password`
- (empty/no password)

Try these if you're unsure.

