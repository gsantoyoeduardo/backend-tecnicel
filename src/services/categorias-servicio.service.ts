import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class CategoriasServicioService {
  async listar() {
    const { data, error } = await supabase
      .from('categorias_servicio')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw new AppError('Error al listar categorias de servicio', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('categorias_servicio')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Categoria no encontrada');
    return data;
  }

  async crear(data: { nombre: string; descripcion?: string }) {
    const { data: existing, error: checkError } = await supabase
      .from('categorias_servicio')
      .select('id')
      .eq('nombre', data.nombre)
      .maybeSingle();

    if (checkError) throw new AppError('Error al verificar categoria', 500);
    if (existing) throw new AppError('Ya existe una categoria con ese nombre', 409);

    const { data: categoria, error } = await supabase
      .from('categorias_servicio')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear categoria: ${error.message}`, 500);
    return categoria;
  }

  async editar(id: string, data: { nombre?: string; descripcion?: string }) {
    const { data: categoria, error } = await supabase
      .from('categorias_servicio')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar categoria: ${error.message}`, 500);
    if (!categoria) throw new NotFoundError('Categoria no encontrada');
    return categoria;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('categorias_servicio')
      .update({ estado: 'eliminado', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar categoria: ${error.message}`, 500);
    return { message: 'Categoria eliminada' };
  }
}

export const categoriasServicioService = new CategoriasServicioService();
