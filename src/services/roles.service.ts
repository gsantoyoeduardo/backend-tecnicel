import { supabase } from '../config/supabase';
import { NotFoundError, AppError } from '../utils/errors';

export class RolesService {
  async listar() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('nombre');

    if (error) throw new AppError('Error al listar roles', 500);
    return data;
  }

  async crear(data: { nombre: string; descripcion?: string }) {
    const { data: rol, error } = await supabase
      .from('roles')
      .insert({ nombre: data.nombre, descripcion: data.descripcion })
      .select('*')
      .single();

    if (error) throw new AppError(`Error al crear rol: ${error.message}`, 500);
    return rol;
  }

  async editar(id: string, data: { nombre?: string; descripcion?: string }) {
    const { data: rol, error } = await supabase
      .from('roles')
      .update({ ...data })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new AppError(`Error al editar rol: ${error.message}`, 500);
    if (!rol) throw new NotFoundError('Rol no encontrado');
    return rol;
  }

  async listarPermisos() {
    const { data, error } = await supabase
      .from('permisos')
      .select('*')
      .order('nombre');

    if (error) throw new AppError('Error al listar permisos', 500);
    return data;
  }

  async asignarPermisos(rolId: string, permisoIds: string[]) {
    const { error: deleteError } = await supabase
      .from('roles_permisos')
      .delete()
      .eq('rol_id', rolId);

    if (deleteError) throw new AppError('Error al limpiar permisos', 500);

    if (permisoIds.length > 0) {
      const inserts = permisoIds.map(permiso_id => ({ rol_id: rolId, permiso_id }));
      const { error } = await supabase.from('roles_permisos').insert(inserts);
      if (error) throw new AppError(`Error al asignar permisos: ${error.message}`, 500);
    }

    return { message: 'Permisos asignados correctamente' };
  }
}

export const rolesService = new RolesService();
