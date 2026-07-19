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
