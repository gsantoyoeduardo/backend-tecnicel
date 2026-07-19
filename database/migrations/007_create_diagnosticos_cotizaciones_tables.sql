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
