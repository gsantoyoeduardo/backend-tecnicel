const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log('=== PRUEBA DE CONEXION SUPABASE ===\n');
console.log('URL:', process.env.SUPABASE_URL);
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 30) + '...\n');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

(async () => {
  console.log('Buscando usuario admin@tecnicel.com...');
  
  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('id, email, password_hash, nombre, apellido, estado, rol_id')
    .eq('email', 'admin@tecnicel.com')
    .single();

  if (error) {
    console.log('\nERROR:', error.message);
    console.log('Detalles:', error);
    return;
  }

  if (!usuario) {
    console.log('\nUsuario NO encontrado');
    return;
  }

  console.log('\nUsuario encontrado:');
  console.log('  Email:', usuario.email);
  console.log('  Nombre:', usuario.nombre, usuario.apellido);
  console.log('  Estado:', usuario.estado);
  console.log('  Rol ID:', usuario.rol_id);
  console.log('  Password hash:', usuario.password_hash.substring(0, 30) + '...');

  console.log('\nProbando bcrypt.compare con "admin123"...');
  const passwordValido = await bcrypt.compare('admin123', usuario.password_hash);
  console.log('  Password válido:', passwordValido);
})();
