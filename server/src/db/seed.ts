import bcrypt from 'bcryptjs';
import { pool } from './connection';

async function seed() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Hash password for admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Insert admin user
    const adminResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['admin@test.com', hashedPassword, 'Admin', 'User', 'admin']
    );
    
    if (adminResult.rows.length > 0) {
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
    
    // Insert sample employer
    const employerPassword = await bcrypt.hash('employer123', 10);
    const employerResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['employer@test.com', employerPassword, 'Employer', 'User', 'employer', '+998901234567']
    );
    
    if (employerResult.rows.length > 0) {
      console.log('✅ Sample employer created');
    }
    
    // Insert sample job seeker
    const jobSeekerPassword = await bcrypt.hash('jobseeker123', 10);
    const jobSeekerResult = await client.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, phone) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (email) DO NOTHING 
       RETURNING id`,
      ['jobseeker@test.com', jobSeekerPassword, 'Job', 'Seeker', 'jobseeker', '+998901234568']
    );
    
    if (jobSeekerResult.rows.length > 0) {
      console.log('✅ Sample job seeker created');
    }
    
    console.log('✅ Database seeding completed successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .then(() => {
    console.log('Seeding process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seeding process failed:', error);
    process.exit(1);
  });

