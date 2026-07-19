const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  console.log('Iniciando seed de datos de prueba...\n');

  const { data: roles } = await supabase.from('roles').select('*');
  const rolAdmin = roles.find(r => r.nombre === 'administrador');
  const rolRecepcion = roles.find(r => r.nombre === 'recepcionista');
  const rolTecnico = roles.find(r => r.nombre === 'tecnico');

  if (!rolAdmin || !rolRecepcion || !rolTecnico) {
    console.error('ERROR: Roles no encontrados. Ejecuta las migraciones primero.');
    return;
  }

  const usuarios = [
    { email: 'admin@tecnicel.com', password: 'admin123', nombre: 'Admin', apellido: 'TecniCel', telefono: '999111222', rol_id: rolAdmin.id },
    { email: 'recepcion@tecnicel.com', password: 'recepcion123', nombre: 'Maria', apellido: 'Garcia', telefono: '999222333', rol_id: rolRecepcion.id },
    { email: 'tecnico@tecnicel.com', password: 'tecnico123', nombre: 'Carlos', apellido: 'Rodriguez', telefono: '999333444', rol_id: rolTecnico.id },
    { email: 'tecnico2@tecnicel.com', password: 'tecnico123', nombre: 'Jose', apellido: 'Martinez', telefono: '999444555', rol_id: rolTecnico.id },
  ];

  for (const u of usuarios) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const { error } = await supabase.from('usuarios').upsert({
      email: u.email,
      password_hash: passwordHash,
      nombre: u.nombre,
      apellido: u.apellido,
      telefono: u.telefono,
      rol_id: u.rol_id,
      estado: 'activo',
    }, { onConflict: 'email' });

    if (error) {
      console.error(`Error creando ${u.email}:`, error.message);
    } else {
      console.log(`Usuario creado: ${u.email} (${u.password})`);
    }
  }

  console.log('\n--- Sucursales ---');
  const { error: sucError } = await supabase.from('sucursales').upsert({
    nombre: 'TecniCel - Sede Principal',
    direccion: 'Av. Principal 123, Lima, Peru',
    telefono: '(01) 234-5678',
    email: 'info@tecnicel.com',
    estado: 'activo',
  }, { onConflict: 'nombre' });
  console.log(sucError ? `Error sucursal: ${sucError.message}` : 'Sucursal creada');

  console.log('\n--- Marcas ---');
  const marcas = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Motorola'];
  for (const marca of marcas) {
    const { error } = await supabase.from('marcas').upsert({ nombre: marca, estado: 'activo' }, { onConflict: 'nombre' });
    console.log(error ? `Error ${marca}: ${error.message}` : `Marca creada: ${marca}`);
  }

  console.log('\n--- Modelos ---');
  const modelosData = [
    { marca: 'Apple', modelos: ['iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'] },
    { marca: 'Samsung', modelos: ['Galaxy S21', 'Galaxy S22', 'Galaxy S23'] },
    { marca: 'Xiaomi', modelos: ['Redmi Note 10', 'Redmi Note 11', 'Redmi Note 12'] },
    { marca: 'Huawei', modelos: ['P30', 'P40'] },
    { marca: 'Motorola', modelos: ['Moto G50', 'Moto G60'] },
  ];

  for (const grupo of modelosData) {
    const { data: marcaData } = await supabase.from('marcas').select('id').eq('nombre', grupo.marca).single();
    if (!marcaData) continue;
    for (const modelo of grupo.modelos) {
      const { error } = await supabase.from('modelos').upsert({
        marca_id: marcaData.id, nombre: modelo, estado: 'activo'
      }, { onConflict: 'marca_id,nombre' });
      console.log(error ? `Error ${modelo}: ${error.message}` : `Modelo creado: ${modelo}`);
    }
  }

  console.log('\n--- Servicios ---');
  const servicios = [
    { nombre: 'Cambio de pantalla', descripcion: 'Reemplazo de pantalla completa', precio_base: 150.00, tiempo_estimado_minutos: 60 },
    { nombre: 'Cambio de bateria', descripcion: 'Reemplazo de bateria original', precio_base: 80.00, tiempo_estimado_minutos: 30 },
    { nombre: 'Reparacion de puerto de carga', descripcion: 'Limpieza o reemplazo de puerto', precio_base: 60.00, tiempo_estimado_minutos: 45 },
    { nombre: 'Reparacion de camara', descripcion: 'Reemplazo de modulo de camara', precio_base: 100.00, tiempo_estimado_minutos: 45 },
    { nombre: 'Reparacion de audio', descripcion: 'Reemplazo de speaker o microfono', precio_base: 70.00, tiempo_estimado_minutos: 30 },
    { nombre: 'Reparacion de botones', descripcion: 'Reemplazo de botones', precio_base: 50.00, tiempo_estimado_minutos: 30 },
    { nombre: 'Diagnostico general', descripcion: 'Revision completa del dispositivo', precio_base: 0.00, tiempo_estimado_minutos: 15 },
    { nombre: 'Liberacion de software', descripcion: 'Desbloqueo y actualizacion', precio_base: 40.00, tiempo_estimado_minutos: 30 },
    { nombre: 'Reparacion de placa', descripcion: 'Reparacion a nivel de placa madre', precio_base: 200.00, tiempo_estimado_minutos: 120 },
    { nombre: 'Cambio de carcasa', descripcion: 'Reemplazo de carcasa trasera', precio_base: 90.00, tiempo_estimado_minutos: 45 },
  ];

  for (const s of servicios) {
    const { error } = await supabase.from('servicios').upsert({
      ...s, estado: 'activo'
    }, { onConflict: 'nombre' });
    console.log(error ? `Error ${s.nombre}: ${error.message}` : `Servicio creado: ${s.nombre}`);
  }

  console.log('\n--- Categoria Servicio ---');
  const categorias = ['Reparacion de pantalla', 'Reparacion de bateria', 'Reparacion de software', 'Reparacion de hardware'];
  for (const cat of categorias) {
    const { error } = await supabase.from('categorias_servicio').upsert({
      nombre: cat, descripcion: cat, estado: 'activo'
    }, { onConflict: 'nombre' });
    console.log(error ? `Error ${cat}: ${error.message}` : `Categoria creada: ${cat}`);
  }

  console.log('\nSeed completado!');
  console.log('\n========================================');
  console.log('CREDENCIALES DE PRUEBA:');
  console.log('========================================');
  console.log('Admin:         admin@tecnicel.com / admin123');
  console.log('Recepcion:     recepcion@tecnicel.com / recepcion123');
  console.log('Tecnico 1:     tecnico@tecnicel.com / tecnico123');
  console.log('Tecnico 2:     tecnico2@tecnicel.com / tecnico123');
  console.log('========================================\n');
}

seed().catch(console.error);
