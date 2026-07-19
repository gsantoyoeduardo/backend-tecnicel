const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  console.log(`Encontradas ${files.length} migraciones\n`);

  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log(`Ejecutando: ${file}...`);
    
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      if (error.message.includes('function exec_sql') || error.message.includes('does not exist')) {
        console.log(`  [SKIP] No se puede ejecutar SQL directo. Ejecuta manualmente en Supabase SQL Editor.`);
        console.log(`  Archivo: database/migrations/${file}\n`);
        continue;
      }
      console.log(`  [WARN] ${error.message}\n`);
    } else {
      console.log(`  [OK] Completado\n`);
    }
  }

  console.log('========================================');
  console.log('INSTRUCCIONES:');
  console.log('========================================');
  console.log('1. Ve a https://supabase.com/dashboard/project/isszxxlrbbkjagkdssih/sql/new-editor');
  console.log('2. Copia y pega el contenido de: database/migrations/015_create_estado_dispositivo.sql');
  console.log('3. Click "Run"');
  console.log('4. Luego ejecuta: node scripts/seed.js');
  console.log('========================================\n');
}

runMigrations().catch(console.error);
