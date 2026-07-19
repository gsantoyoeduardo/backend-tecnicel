CREATE TABLE IF NOT EXISTS estado_dispositivo (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('ingreso', 'salida')),
  estado_general VARCHAR(50),
  pantalla_estado VARCHAR(50),
  carcasa_estado VARCHAR(50),
  botones_estado VARCHAR(50),
  camara_estado VARCHAR(50),
  audio_estado VARCHAR(50),
  carga_bateria INTEGER CHECK (carga_bateria BETWEEN 0 AND 100),
  accesorios_entregados TEXT[],
  fotos TEXT[],
  observaciones TEXT,
  observaciones_adicionales TEXT,
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_estado_dispositivo_solicitud ON estado_dispositivo(solicitud_id);
CREATE INDEX IF NOT EXISTS idx_estado_dispositivo_tipo ON estado_dispositivo(tipo);
