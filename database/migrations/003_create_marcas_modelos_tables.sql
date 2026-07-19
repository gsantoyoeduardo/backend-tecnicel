CREATE TABLE IF NOT EXISTS marcas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(100) NOT NULL UNIQUE,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS modelos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  marca_id UUID REFERENCES marcas(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,
  anio INTEGER,
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO marcas (nombre) VALUES
  ('Samsung'), ('Apple'), ('Xiaomi'), ('Huawei'), ('Motorola'),
  ('LG'), ('Sony'), ('Nokia'), ('OnePlus'), ('Oppo'),
  ('Vivo'), ('Realme'), ('ZTE'), ('ASUS'), ('Google')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO modelos (marca_id, nombre, anio)
SELECT m.id, 'Galaxy A54', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy S23', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy S23 Ultra', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy A14', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'Galaxy A34', 2023 FROM marcas m WHERE m.nombre = 'Samsung'
UNION ALL SELECT m.id, 'iPhone 14', 2022 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 14 Pro', 2022 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 15', 2023 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'iPhone 15 Pro Max', 2023 FROM marcas m WHERE m.nombre = 'Apple'
UNION ALL SELECT m.id, 'Redmi Note 12', 2023 FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL SELECT m.id, 'Poco X5 Pro', 2023 FROM marcas m WHERE m.nombre = 'Xiaomi'
UNION ALL SELECT m.id, 'Huawei P60', 2023 FROM marcas m WHERE m.nombre = 'Huawei'
UNION ALL SELECT m.id, 'Moto G73', 2023 FROM marcas m WHERE m.nombre = 'Motorola'
UNION ALL SELECT m.id, 'Pixel 7', 2022 FROM marcas m WHERE m.nombre = 'Google'
UNION ALL SELECT m.id, 'Pixel 8', 2023 FROM marcas m WHERE m.nombre = 'Google';
