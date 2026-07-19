CREATE TABLE IF NOT EXISTS sucursales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(200) NOT NULL,
  direccion TEXT NOT NULL,
  telefono VARCHAR(20),
  email VARCHAR(255),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  estado VARCHAR(20) DEFAULT 'activo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS horarios_sucursales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE CASCADE,
  dia_semana INTEGER NOT NULL CHECK (dia_semana BETWEEN 0 AND 6),
  hora_apertura TIME NOT NULL,
  hora_cierre TIME NOT NULL,
  estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  dispositivo_id UUID REFERENCES dispositivos(id) ON DELETE SET NULL,
  servicio_id UUID REFERENCES servicios(id) ON DELETE SET NULL,
  sucursal_id UUID REFERENCES sucursales(id) ON DELETE SET NULL,
  descripcion_problema TEXT,
  modalidad VARCHAR(20) DEFAULT 'sucursal' CHECK (modalidad IN ('sucursal', 'domicilio', 'recojo_entrega')),
  direccion_id UUID REFERENCES direcciones(id) ON DELETE SET NULL,
  fecha_preferida DATE,
  horario_preferido VARCHAR(20),
  estado VARCHAR(30) DEFAULT 'solicitud_registrada' CHECK (estado IN (
    'solicitud_registrada', 'solicitud_confirmada', 'recojo_programado',
    'repartidor_en_camino', 'equipo_recogido', 'recibido_en_taller',
    'en_diagnostico', 'esperando_aprobacion', 'cotizacion_aprobada',
    'en_reparacion', 'esperando_repuesto', 'en_control_calidad',
    'listo_para_entrega', 'en_camino_al_cliente', 'entregado',
    'finalizado', 'cancelado'
  )),
  tecnico_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  repartidor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  codigo_seguimiento VARCHAR(10) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tracking_solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  estado VARCHAR(30) NOT NULL,
  comentario TEXT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS observaciones_solicitudes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  observacion TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
