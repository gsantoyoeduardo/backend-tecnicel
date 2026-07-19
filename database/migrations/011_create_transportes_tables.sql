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
