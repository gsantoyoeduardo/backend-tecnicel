const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres.isszxxlrbbkjagkdssih:73579490.Jose   o  3104@aws-0-us-west-1.pooler.supabase.co:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

    console.log(`Encontradas ${files.length} migraciones`);

    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
      console.log(`Ejecutando: ${file}...`);
      await client.query(sql);
      console.log(`  Completado: ${file}`);
    }

    console.log('\nTodas las migraciones ejecutadas correctamente');
  } catch (error) {
    console.error('Error ejecutando migraciones:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
