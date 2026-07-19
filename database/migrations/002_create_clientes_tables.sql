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
