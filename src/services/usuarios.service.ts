import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';
import { AppError, NotFoundError } from '../utils/errors';

export class UsuariosService {
  async listar() {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, telefono, estado, rol_id, roles(nombre), created_at')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar usuarios', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, telefono, estado, rol_id, roles(nombre), created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Usuario no encontrado');
    return data;
  }

  async crear(data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    rol_id: string;
  }) {
    const { data: existing } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (existing) throw new AppError('El email ya esta registrado', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .insert({
        email: data.email,
        password_hash: passwordHash,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || null,
        rol_id: data.rol_id,
        estado: 'activo',
      })
      .select('id, email, nombre, apellido, telefono, estado, rol_id')
      .single();

    if (error) throw new AppError(`Error al crear usuario: ${error.message}`, 500);

    return usuario;
  }

  async editar(id: string, data: {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    rol_id?: string;
  }) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, email, nombre, apellido, telefono, estado, rol_id')
      .single();

    if (error) throw new AppError(`Error al editar: ${error.message}`, 500);
    if (!usuario) throw new NotFoundError('Usuario no encontrado');

    return usuario;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data, error } = await supabase
      .from('usuarios')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, nombre, estado')
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Usuario no encontrado');

    return data;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('usuarios')
      .update({ estado: 'eliminado', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar: ${error.message}`, 500);

    return { message: 'Usuario eliminado' };
  }
}

export const usuariosService = new UsuariosService();
