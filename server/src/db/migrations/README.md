# Database Migrations

## Running Migrations

To apply the user profiles migration, run the SQL file against your PostgreSQL database:

```bash
# Using psql
psql -U your_username -d your_database -f server/src/db/migrations/add_user_profiles.sql

# Or using a database client like pgAdmin, DBeaver, etc.
# Open the file and execute it
```

## Migration: add_user_profiles.sql

This migration adds the following tables:
- `user_profiles` - Extended profile information
- `user_education` - User education history
- `user_experience` - User work experience
- `user_portfolio` - User portfolio projects

All tables include proper indexes and triggers for automatic timestamp updates.

