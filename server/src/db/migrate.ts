import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { pool } from './connection';

async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting database migration...');
    
    // Read and execute schema file first
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');
    
    console.log('📄 Executing schema.sql...');
    await client.query(schema);
    console.log('✅ schema.sql executed successfully');
    
    // Read and execute migration files
    const migrationsDir = join(__dirname, 'migrations');
    try {
      const migrationFiles = readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Execute in alphabetical order
      
      for (const file of migrationFiles) {
        const migrationPath = join(migrationsDir, file);
        const migration = readFileSync(migrationPath, 'utf-8');
        
        console.log(`📄 Executing migration: ${file}...`);
        await client.query(migration);
        console.log(`✅ ${file} executed successfully`);
      }
    } catch (error: any) {
      // If migrations directory doesn't exist, it's okay
      if (error.code !== 'ENOENT') {
        throw error;
      }
      console.log('ℹ️  No migrations directory found, skipping...');
    }
    
    console.log('✅ Database migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

migrate()
  .then(() => {
    console.log('Migration process finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration process failed:', error);
    process.exit(1);
  });

