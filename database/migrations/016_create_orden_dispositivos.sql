CREATE TABLE IF NOT EXISTS orden_dispositivos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  dispositivo_id UUID REFERENCES dispositivos(id),
  marca VARCHAR(100),
  modelo VARCHAR(100),
  imei VARCHAR(50),
  color VARCHAR(50),
  estado_inicial TEXT,
  bateria INTEGER,
  accesorios TEXT[],
  fotos TEXT[],
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orden_dispositivos_orden ON orden_dispositivos(orden_id);
CREATE INDEX IF NOT EXISTS idx_orden_dispositivos_dispositivo ON orden_dispositivos(dispositivo_id);
