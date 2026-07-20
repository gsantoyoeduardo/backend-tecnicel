export type PagoEstado = 'pendiente' | 'confirmado' | 'anulado';

export type MetodoPago = 'efectivo' | 'tarjeta' | 'yape' | 'plin' | 'transferencia';

export interface Pago {
  id: string;
  solicitud_id: string;
  cliente_id: string;
  monto: number;
  metodo_pago: MetodoPago;
  estado: PagoEstado;
  comprobante_url: string | null;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  solicitudes?: {
    id: string;
    codigo_seguimiento: string;
    estado: string;
    modalidad: string;
    descripcion_problema: string;
    cliente_id: string;
  };
}

export interface CrearPagoData {
  monto: number;
  metodoPago: MetodoPago;
  descripcion?: string;
}
