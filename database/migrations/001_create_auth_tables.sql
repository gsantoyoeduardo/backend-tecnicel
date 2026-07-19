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
