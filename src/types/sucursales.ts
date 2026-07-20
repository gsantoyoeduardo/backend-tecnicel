export type SucursalEstado = 'activo' | 'inactivo';

export interface Sucursal {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string | null;
  email: string | null;
  latitud: string | null;
  longitud: string | null;
  estado: SucursalEstado;
  created_at: string;
  updated_at: string;
}

export interface Horario {
  id: string;
  sucursal_id: string;
  dia_semana: number;
  hora_apertura: string;
  hora_cierre: string;
}

export interface CrearSucursalData {
  nombre: string;
  direccion: string;
  telefono?: string;
  email?: string;
  latitud?: string;
  longitud?: string;
}

export interface ActualizarSucursalData {
  nombre?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  latitud?: string;
  longitud?: string;
}

export interface ConfigurarHorarioData {
  diaSemana: number;
  horaApertura: string;
  horaCierre: string;
}
