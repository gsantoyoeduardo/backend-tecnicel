export interface Calificacion {
  id: string;
  solicitud_id: string;
  cliente_id: string;
  calificacion: number;
  comentario: string | null;
  created_at: string;
  solicitudes?: {
    id: string;
    codigo_seguimiento: string;
    estado: string;
    modalidad: string;
    descripcion_problema: string;
    servicios?: {
      nombre: string;
    };
  };
}

export type ReclamoEstado = 'pendiente' | 'en_revision' | 'resuelto' | 'cerrado';

export interface Reclamo {
  id: string;
  solicitud_id: string;
  cliente_id: string;
  motivo: string;
  descripcion: string;
  estado: ReclamoEstado;
  respuesta: string | null;
  created_at: string;
  updated_at: string;
  solicitudes?: {
    id: string;
    codigo_seguimiento: string;
    estado: string;
    modalidad: string;
    descripcion_problema: string;
    servicios?: {
      nombre: string;
    };
  };
}

export interface ActualizarReclamoData {
  estado: ReclamoEstado;
  respuesta?: string;
}
