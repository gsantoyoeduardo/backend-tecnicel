export type TransporteEstado = 'pendiente' | 'en_camino' | 'completado' | 'cancelado';

export type TransporteTipo = 'recojo' | 'entrega';

export interface Transporte {
  id: string;
  solicitud_id: string;
  repartidor_id: string | null;
  tipo: TransporteTipo;
  estado: TransporteEstado;
  fecha_programada: string | null;
  direccion_recogida: string | null;
  direccion_entrega: string | null;
  latitud: string | null;
  longitud: string | null;
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
  repartidores?: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface UbicacionTransporte {
  id: string;
  latitud: string | null;
  longitud: string | null;
  updated_at: string;
}

export interface ProgramarRecojoData {
  repartidorId?: string;
  fechaProgramada?: string;
  direccionRecogida?: string;
}

export interface ProgramarEntregaData {
  repartidorId?: string;
  fechaProgramada?: string;
  direccionEntrega?: string;
}

export interface ActualizarTransporteData {
  repartidorId?: string;
  fechaProgramada?: string;
  direccionRecogida?: string;
  direccionEntrega?: string;
}

export interface EnviarUbicacionData {
  latitud: string;
  longitud: string;
}
