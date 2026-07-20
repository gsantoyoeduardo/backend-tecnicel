export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  estado: string;
  rol_id: string;
  roles?: { nombre: string };
  created_at: string;
  updated_at?: string;
}

export interface CrearUsuarioData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  rol_id: string;
}

export interface EditarUsuarioData {
  nombre?: string;
  apellido?: string;
  telefono?: string;
  rol_id?: string;
}

export interface Rol {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CrearRolData {
  nombre: string;
  descripcion?: string;
}

export interface EditarRolData {
  nombre?: string;
  descripcion?: string;
}

export interface Permiso {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at?: string;
}
