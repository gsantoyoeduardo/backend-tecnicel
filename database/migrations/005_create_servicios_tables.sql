CREATE TABLE IF NOT EXISTS categorias_servicio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  categoria_id UUID REFERENCES categorias_servicio(id) ON DELETE SET NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  precio_base DECIMAL(10, 2) DEFAULT 0,
  duracion_estimada_minutos INTEGER DEFAULT 60,
  permite_domicilio BOOLEAN DEFAULT false,
  permite_recojo BOOLEAN DEFAULT false,
  permite_sucursal BOOLEAN DEFAULT true,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicios_modelos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modelo_id UUID REFERENCES modelos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
  precio_estimado DECIMAL(10, 2) DEFAULT 0,
  duracion_estimada_minutos INTEGER DEFAULT 60,
  permite_domicilio BOOLEAN DEFAULT false,
  permite_recojo BOOLEAN DEFAULT false,
  permite_sucursal BOOLEAN DEFAULT true,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(modelo_id, servicio_id)
);

INSERT INTO categorias_servicio (nombre, descripcion) VALUES
  ('Pantalla', 'Servicios relacionados con pantalla y display'),
  ('Bateria', 'Servicios de bateria y carga'),
  ('Software', 'Instalacion, actualizacion y reparacion de software'),
  ('Camara', 'Reparacion de camaras'),
  ('Puerto de carga', 'Reparacion de puertos de carga y conectores'),
  ('Placa electronica', 'Reparacion de placa base y componentes electronicos'),
  ('Mantenimiento', 'Limpieza y mantenimiento preventivo'),
  ('Audio', 'Reparacion de parlantes, microfonos y audio')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO servicios (categoria_id, nombre, descripcion, precio_base, duracion_estimada_minutos, permite_domicilio, permite_recojo, permite_sucursal)
SELECT c.id, 'Cambio de pantalla', 'Reemplazo completo del modulo de pantalla', 150, 120, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Pantalla'
UNION ALL SELECT c.id, 'Cambio de vidrio templado', 'Reemplazo de vidrio protector', 25, 20, false, false, true
FROM categorias_servicio c WHERE c.nombre = 'Pantalla'
UNION ALL SELECT c.id, 'Cambio de bateria', 'Reemplazo de bateria interna', 80, 60, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Bateria'
UNION ALL SELECT c.id, 'Reparacion de puerto de carga', 'Reparacion o reemplazo del puerto de carga', 70, 90, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Puerto de carga'
UNION ALL SELECT c.id, 'Actualizacion de software', 'Actualizacion del sistema operativo', 30, 45, true, false, true
FROM categorias_servicio c WHERE c.nombre = 'Software'
UNION ALL SELECT c.id, 'Liberacion de patron/contraseña', 'Desbloqueo de pantalla de bloqueo', 25, 30, true, true, true
FROM categorias_servicio c WHERE c.nombre = 'Software'
UNION ALL SELECT c.id, 'Cambio de camara trasera', 'Reemplazo de modulo de camara trasera', 120, 90, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Camara'
UNION ALL SELECT c.id, 'Reparacion de placa', 'Diagnostico y reparacion de placa base', 200, 240, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Placa electronica'
UNION ALL SELECT c.id, 'Mantenimiento preventivo', 'Limpieza interna y revision general', 40, 45, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Mantenimiento'
UNION ALL SELECT c.id, 'Cambio de parlante/auricular', 'Reemplazo de parlante o auricular', 55, 60, false, true, true
FROM categorias_servicio c WHERE c.nombre = 'Audio';
