CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(50) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS permisos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS roles_permisos (
  rol_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permiso_id UUID REFERENCES permisos(id) ON DELETE CASCADE,
  PRIMARY KEY (rol_id, permiso_id)
);

CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  rol_id UUID REFERENCES roles(id),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO roles (id, nombre, descripcion) VALUES
  (uuid_generate_v4(), 'administrador', 'Control total del sistema'),
  (uuid_generate_v4(), 'recepcionista', 'Gestion de solicitudes y clientes'),
  (uuid_generate_v4(), 'tecnico', 'Diagnostico y reparacion de equipos'),
  (uuid_generate_v4(), 'repartidor', 'Recojo y entrega de equipos'),
  (uuid_generate_v4(), 'cliente', 'Cliente que solicita servicios')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO permisos (nombre, descripcion) VALUES
  ('usuarios.ver', 'Ver usuarios'),
  ('usuarios.crear', 'Crear usuarios'),
  ('usuarios.editar', 'Editar usuarios'),
  ('usuarios.eliminar', 'Eliminar usuarios'),
  ('roles.gestionar', 'Gestionar roles y permisos'),
  ('marcas.gestionar', 'Gestionar marcas'),
  ('modelos.gestionar', 'Gestionar modelos'),
  ('servicios.gestionar', 'Gestionar servicios'),
  ('solicitudes.ver', 'Ver solicitudes'),
  ('solicitudes.gestionar', 'Gestionar solicitudes'),
  ('diagnosticos.gestionar', 'Gestionar diagnosticos'),
  ('cotizaciones.gestionar', 'Gestionar cotizaciones'),
  ('reparaciones.gestionar', 'Gestionar reparaciones'),
  ('productos.gestionar', 'Gestionar productos'),
  ('inventario.gestionar', 'Gestionar inventario'),
  ('tecnicos.gestionar', 'Gestionar tecnicos'),
  ('transportes.gestionar', 'Gestionar transportes'),
  ('pagos.gestionar', 'Gestionar pagos'),
  ('reportes.ver', 'Ver reportes y dashboard'),
  ('sucursales.gestionar', 'Gestionar sucursales'),
  ('clientes.gestionar', 'Gestionar clientes')
ON CONFLICT (nombre) DO NOTHING;
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo_documento VARCHAR(20) DEFAULT 'dni',
  numero_documento VARCHAR(20),
  fecha_nacimiento DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS direcciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  direccion TEXT NOT NULL,
  distrito VARCHAR(100),
  provincia VARCHAR(100),
  departamento VARCHAR(100),
  referencia TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  es_principal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modelos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marca_id UUID REFERENCES marcas(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,
  anio INTEGER,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO marcas (nombre) VALUES
  ('Samsung'), ('Apple'), ('Xiaomi'), ('Huawei'), ('Motorola'),
  ('LG'), ('Sony'), ('Nokia'), ('OnePlus'), ('Oppo'),
  ('Vivo'), ('Realme'), ('ZTE'), ('ASUS'), ('Google')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO modelos (marca_id, nombre, anio)
SELECT m.id, 'Galaxy A54', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy S23', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy S23 Ultra', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy A14', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy A34', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'iPhone 14', 2022 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 14 Pro', 2022 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 15', 2023 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 15 Pro Max', 2023 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'Redmi Note 12', 2023 FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL SELECT m.id, 'Poco X5 Pro', 2023 FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL SELECT m.id, 'Huawei P60', 2023 FROM marcas m WHERE m.nombre = 'Huawei'
UNION ALL SELECT m.id, 'Moto G73', 2023 FROM marcas m WHERE m.nombre = 'Motorola'
UNION ALL SELECT m.id, 'Pixel 7', 2022 FROM marcas m WHERE m.nombre = 'Google'
UNION ALL SELECT m.id, 'Pixel 8', 2023 FROM marcas m WHERE m.nombre = 'Google';
CREATE TABLE IF NOT EXISTS dispositivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  modelo_id UUID REFERENCES modelos(id) ON DELETE SET NULL,
  imei VARCHAR(20),
  color VARCHAR(50),
  alias VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
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
CREATE TABLE IF NOT EXISTS sucursales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  direccion TEXT NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios_sucursales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_apertura TIME NOT NULL,
  hora_cierre TIME NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  dispositivo_id UUID REFERENCES dispositivos(id) ON DELETE SET NULL,
  servicio_id UUID REFERENCES servicios(id) ON DELETE SET NULL,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  descripcion_problema TEXT,
  modalidad VARCHAR(20) DEFAULT 'sucursal' CHECK (modalidad IN ('sucursal', 'domicilio', 'recojo_entrega')),
  direccion_id UUID REFERENCES direcciones(id) ON DELETE SET NULL,
  fecha_preferida DATE,
  horario_preferido VARCHAR(20),
  estado VARCHAR(30) DEFAULT 'solicitud_registrada' CHECK (estado IN (
    'solicitud_registrada', 'solicitud_confirmada', 'recojo_programado',
    'repartidor_en_camino', 'equipo_recogido', 'recibido_en_taller',
    'en_diagnostico', 'esperando_aprobacion', 'cotizacion_aprobada',
    'en_reparacion', 'esperando_repuesto', 'en_control_calidad',
    'listo_para_entrega', 'en_camino_al_cliente', 'entregado',
    'finalizado', 'cancelado'
  )),
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  repartidor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  codigo_seguimiento VARCHAR(10) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  estado VARCHAR(30) NOT NULL,
  comentario TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observaciones_solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  observacion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS diagnosticos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  problema_detectado TEXT NOT NULL,
  solucion_propuesta TEXT NOT NULL,
  observaciones TEXT,
  requiere_repuesto BOOLEAN DEFAULT false,
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS diagnosticos_evidencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostico_id UUID REFERENCES diagnosticos(id) ON DELETE CASCADE,
  url_archivo TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'imagen',
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotizaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  mano_de_obra DECIMAL(10, 2) DEFAULT 0,
  descuento DECIMAL(10, 2) DEFAULT 0,
  impuesto DECIMAL(10, 2) DEFAULT 0,
  observaciones TEXT,
  total DECIMAL(10, 2) DEFAULT 0,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviada', 'aprobada', 'rechazada')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cotizaciones_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id UUID,
  cantidad INTEGER DEFAULT 1,
  precio_unitario DECIMAL(10, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) DEFAULT 0
);
CREATE TABLE IF NOT EXISTS reparaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_inicio TIMESTAMPTZ,
  fecha_fin TIMESTAMPTZ,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_progreso', 'finalizada', 'cancelada')),
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reparaciones_repuestos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reparacion_id UUID REFERENCES reparaciones(id) ON DELETE CASCADE,
  producto_id UUID,
  cantidad INTEGER DEFAULT 1,
  precio_unitario DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reparaciones_evidencias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reparacion_id UUID REFERENCES reparaciones(id) ON DELETE CASCADE,
  url_archivo TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'imagen',
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS control_calidad (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reparacion_id UUID REFERENCES reparaciones(id) ON DELETE CASCADE,
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  pruebas_realizadas TEXT NOT NULL,
  resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('aprobado', 'rechazado', 'pendiente')),
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  sku VARCHAR(50) UNIQUE,
  tipo VARCHAR(20) DEFAULT 'repuesto' CHECK (tipo IN ('repuesto', 'accesorio', 'insumo')),
  precio_compra DECIMAL(10, 2) DEFAULT 0,
  precio_venta DECIMAL(10, 2) DEFAULT 0,
  stock_minimo INTEGER DEFAULT 5,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modelos_productos (
  modelo_id UUID REFERENCES modelos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  PRIMARY KEY (modelo_id, producto_id)
);

CREATE TABLE IF NOT EXISTS inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(producto_id, sucursal_id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'transferencia')),
  cantidad INTEGER NOT NULL,
  motivo TEXT,
  referencia_id UUID,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS tecnicos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad VARCHAR(200),
  experiencia_anios INTEGER DEFAULT 0,
  disponibilidad BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tecnicos_servicios (
  tecnico_id UUID REFERENCES tecnicos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id) ON DELETE CASCADE,
  PRIMARY KEY (tecnico_id, servicio_id)
);
CREATE TABLE IF NOT EXISTS transportes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('recojo', 'entrega')),
  repartidor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_programada TIMESTAMPTZ,
  fecha_realizada TIMESTAMPTZ,
  direccion_recogida TEXT,
  direccion_entrega TEXT,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_camino', 'completado', 'cancelado')),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  monto DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50) NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'anulado')),
  comprobante_url TEXT,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'general',
  leida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens_dispositivo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'push',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS calificaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  calificacion INTEGER NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
  comentario TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reclamos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  motivo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_revision', 'resuelto', 'cerrado')),
  respuesta TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
