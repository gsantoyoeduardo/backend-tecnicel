export type TipoEstado = 'ingreso' | 'salida';

export type EstadoCondicion = 'excelente' | 'bueno' | 'regular' | 'malo' | 'danado';

export interface EstadoDispositivo {
  id: string;
  solicitud_id: string;
  tipo: TipoEstado;
  estado_general: EstadoCondicion | null;
  pantalla_estado: EstadoCondicion | null;
  carcasa_estado: EstadoCondicion | null;
  botones_estado: EstadoCondicion | null;
  camara_estado: EstadoCondicion | null;
  audio_estado: EstadoCondicion | null;
  carga_bateria: number | null;
  accesorios_entregados: string[];
  fotos: string[];
  observaciones: string | null;
  observaciones_adicionales: string | null;
  tecnico_id: string;
  created_at: string;
  updated_at: string;
  usuarios?: {
    nombre: string;
    apellido: string;
  };
}

export interface CreateEstadoDispositivoData {
  tipo: TipoEstado;
  estado_general?: EstadoCondicion;
  pantalla_estado?: EstadoCondicion;
  carcasa_estado?: EstadoCondicion;
  botones_estado?: EstadoCondicion;
  camara_estado?: EstadoCondicion;
  audio_estado?: EstadoCondicion;
  carga_bateria?: number;
  accesorios_entregados?: string[];
  fotos?: string[];
  observaciones?: string;
  observaciones_adicionales?: string;
}

export interface UpdateEstadoDispositivoData {
  estado_general?: EstadoCondicion;
  pantalla_estado?: EstadoCondicion;
  carcasa_estado?: EstadoCondicion;
  botones_estado?: EstadoCondicion;
  camara_estado?: EstadoCondicion;
  audio_estado?: EstadoCondicion;
  carga_bateria?: number;
  accesorios_entregados?: string[];
  fotos?: string[];
  observaciones?: string;
  observaciones_adicionales?: string;
}

export interface UploadImageResponse {
  url: string;
  path: string;
}
