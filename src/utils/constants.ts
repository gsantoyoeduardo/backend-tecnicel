export const ROLES = {
  ADMINISTRADOR: 'administrador',
  RECEPCIONISTA: 'recepcionista',
  TECNICO: 'tecnico',
  REPARTIDOR: 'repartidor',
  CLIENTE: 'cliente',
} as const;

export type Rol = (typeof ROLES)[keyof typeof ROLES];

export const MODALIDADES = {
  SUCURSAL: 'sucursal',
  DOMICILIO: 'domicilio',
  RECOJO_ENTREGA: 'recojo_entrega',
} as const;

export type Modalidad = (typeof MODALIDADES)[keyof typeof MODALIDADES];

export const ESTADOS_SOLICITUD = [
  'solicitud_registrada',
  'solicitud_confirmada',
  'recojo_programado',
  'repartidor_en_camino',
  'equipo_recogido',
  'recibido_en_taller',
  'en_diagnostico',
  'esperando_aprobacion',
  'cotizacion_aprobada',
  'en_reparacion',
  'esperando_repuesto',
  'en_control_calidad',
  'listo_para_entrega',
  'en_camino_al_cliente',
  'entregado',
  'finalizado',
  'cancelado',
] as const;

export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

export const TIPOS_MOVIMIENTO_INVENTARIO = {
  ENTRADA: 'entrada',
  SALIDA: 'salida',
  AJUSTE: 'ajuste',
  TRANSFERENCIA: 'transferencia',
} as const;

export type TipoMovimiento = (typeof TIPOS_MOVIMIENTO_INVENTARIO)[keyof typeof TIPOS_MOVIMIENTO_INVENTARIO];

export const ESTADOS_COTIZACION = {
  PENDIENTE: 'pendiente',
  ENVIADA: 'enviada',
  APROBADA: 'aprobada',
  RECHAZADA: 'rechazada',
} as const;

export type EstadoCotizacion = (typeof ESTADOS_COTIZACION)[keyof typeof ESTADOS_COTIZACION];

export const ESTADOS_PAGO = {
  PENDIENTE: 'pendiente',
  CONFIRMADO: 'confirmado',
  ANULADO: 'anulado',
} as const;

export type EstadoPago = (typeof ESTADOS_PAGO)[keyof typeof ESTADOS_PAGO];

export const TIPOS_TRANSPORTE = {
  RECOJO: 'recojo',
  ENTREGA: 'entrega',
} as const;

export type TipoTransporte = (typeof TIPOS_TRANSPORTE)[keyof typeof TIPOS_TRANSPORTE];

export const TIPOS_PRODUCTO = {
  REPUESTO: 'repuesto',
  ACCESORIO: 'accesorio',
  INSUMO: 'insumo',
} as const;

export type TipoProducto = (typeof TIPOS_PRODUCTO)[keyof typeof TIPOS_PRODUCTO];
