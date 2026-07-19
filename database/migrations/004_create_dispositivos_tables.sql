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
