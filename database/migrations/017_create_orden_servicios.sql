CREATE TABLE IF NOT EXISTS orden_servicios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  orden_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  dispositivo_orden_id UUID REFERENCES orden_dispositivos(id) ON DELETE CASCADE,
  servicio_id UUID REFERENCES servicios(id),
  cantidad INTEGER DEFAULT 1,
  precio_unitario DECIMAL(10,2),
  subtotal DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orden_servicios_orden ON orden_servicios(orden_id);
CREATE INDEX IF NOT EXISTS idx_orden_servicios_dispositivo ON orden_servicios(dispositivo_orden_id);
CREATE INDEX IF NOT EXISTS idx_orden_servicios_servicio ON orden_servicios(servicio_id);
