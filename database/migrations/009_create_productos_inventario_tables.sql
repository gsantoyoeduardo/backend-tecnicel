CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  sku VARCHAR(50) UNIQUE,
  tipo VARCHAR(20) DEFAULT 'repuesto' CHECK (tipo IN ('repuesto', 'accesorio', 'insumo')),
  precio_compra DECIMAL(10, 2) DEFAULT 0,
  precio_venta DECIMAL(10, 2) DEFAULT 0,
  stock_minimo INTEGER DEFAULT 5,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modelos_productos (
  modelo_id UUID REFERENCES modelos(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  PRIMARY KEY (modelo_id, producto_id)
);

CREATE TABLE IF NOT EXISTS inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  cantidad INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(producto_id, sucursal_id)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida', 'ajuste', 'transferencia')),
  cantidad INTEGER NOT NULL,
  motivo TEXT,
  referencia_id UUID,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
