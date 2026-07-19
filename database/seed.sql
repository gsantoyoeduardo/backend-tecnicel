-- ============================================
-- DATOS DE PRUEBA - TecniCel
-- Ejecutar en Supabase SQL Editor
-- ============================================

-- 1. Crear usuarios de prueba
-- Contraseñas: todas son "123456" (hash bcrypt)
-- admin123, recepcion123, tecnico123

-- Admin
INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id, estado)
VALUES (
  'admin@tecnicel.com',
  '$2a$10$rQZm8Cv7XH5J vXw7Jq8eOeYhGjKLkF9XhJ8vXhJ8vXhJ8vXhJ8vX',
  'Admin',
  'TecniCel',
  '999111222',
  (SELECT id FROM roles WHERE nombre = 'administrador'),
  'activo'
) ON CONFLICT (email) DO NOTHING;

-- Recepcionista
INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id, estado)
VALUES (
  'recepcion@tecnicel.com',
  '$2a$10$rQZm8Cv7XH5J vXw7Jq8eOeYhGjKLkF9XhJ8vXhJ8vXhJ8vXhJ8vX',
  'Maria',
  'Garcia',
  '999222333',
  (SELECT id FROM roles WHERE nombre = 'recepcionista'),
  'activo'
) ON CONFLICT (email) DO NOTHING;

-- Tecnico 1
INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id, estado)
VALUES (
  'tecnico@tecnicel.com',
  '$2a$10$rQZm8Cv7XH5J vXw7Jq8eOeYhGjKLkF9XhJ8vXhJ8vXhJ8vXhJ8vX',
  'Carlos',
  'Rodriguez',
  '999333444',
  (SELECT id FROM roles WHERE nombre = 'tecnico'),
  'activo'
) ON CONFLICT (email) DO NOTHING;

-- Tecnico 2
INSERT INTO usuarios (email, password_hash, nombre, apellido, telefono, rol_id, estado)
VALUES (
  'tecnico2@tecnicel.com',
  '$2a$10$rQZm8Cv7XH5J vXw7Jq8eOeYhGjKLkF9XhJ8vXhJ8vXhJ8vXhJ8vX',
  'Jose',
  'Martinez',
  '999444555',
  (SELECT id FROM roles WHERE nombre = 'tecnico'),
  'activo'
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- NOTA IMPORTANTE:
-- Las contraseñas de arriba son placeholders.
-- Necesitas generar los hashes bcrypt reales.
-- Usa este script alternativo con Node.js:
--
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log('admin:', h));"
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('recepcion123', 10).then(h => console.log('recepcion:', h));"
-- node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('tecnico123', 10).then(h => console.log('tecnico:', h));"
-- ============================================

-- 2. Crear sucursal
INSERT INTO sucursales (nombre, direccion, telefono, email, estado)
VALUES (
  'TecniCel - Sede Principal',
  'Av. Principal 123, Lima, Peru',
  '(01) 234-5678',
  'info@tecnicel.com',
  'activo'
) ON CONFLICT DO NOTHING;

-- 3. Crear marcas
INSERT INTO marcas (nombre, estado) VALUES
  ('Apple', 'activo'),
  ('Samsung', 'activo'),
  ('Xiaomi', 'activo'),
  ('Huawei', 'activo'),
  ('Motorola', 'activo')
ON CONFLICT (nombre) DO NOTHING;

-- 4. Crear modelos
INSERT INTO modelos (marca_id, nombre, estado)
SELECT m.id, 'iPhone 12', 'activo' FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL
SELECT m.id, 'iPhone 13', 'activo' FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL
SELECT m.id, 'iPhone 14', 'activo' FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL
SELECT m.id, 'iPhone 15', 'activo' FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL
SELECT m.id, 'Galaxy S21', 'activo' FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL
SELECT m.id, 'Galaxy S22', 'activo' FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL
SELECT m.id, 'Galaxy S23', 'activo' FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL
SELECT m.id, 'Redmi Note 10', 'activo' FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL
SELECT m.id, 'Redmi Note 11', 'activo' FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL
SELECT m.id, 'Redmi Note 12', 'activo' FROM marcas m WHERE m.nombre = 'Xiaomi'
ON CONFLICT DO NOTHING;

-- 5. Crear servicios
INSERT INTO servicios (nombre, descripcion, precio_base, tiempo_estimado_minutos, estado) VALUES
  ('Cambio de pantalla', 'Reemplazo de pantalla completa', 150.00, 60, 'activo'),
  ('Cambio de bateria', 'Reemplazo de bateria original', 80.00, 30, 'activo'),
  ('Reparacion de puerto de carga', 'Limpieza o reemplazo de puerto', 60.00, 45, 'activo'),
  ('Reparacion de camara', 'Reemplazo de modulo de camara', 100.00, 45, 'activo'),
  ('Reparacion de audio', 'Reemplazo de speaker o microfono', 70.00, 30, 'activo'),
  ('Reparacion de botones', 'Reemplazo de botones de volumen/encendido', 50.00, 30, 'activo'),
  ('Diagnostico general', 'Revision completa del dispositivo', 0.00, 15, 'activo'),
  ('Liberacion de software', 'Desbloqueo y actualizacion de software', 40.00, 30, 'activo'),
  ('Reparacion de placa', 'Reparacion a nivel de placa madre', 200.00, 120, 'activo'),
  ('Cambio de carcasa', 'Reemplazo de carcasa trasera', 90.00, 45, 'activo')
ON CONFLICT DO NOTHING;
