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
