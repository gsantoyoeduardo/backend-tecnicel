import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class MarcasService {
  async listar() {
    const { data, error } = await supabase
      .from('marcas')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) throw new AppError('Error al listar marcas', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('marcas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Marca no encontrada');
    return data;
  }

  async crear(data: { nombre: string }) {
    const { data: existing, error: checkError } = await supabase
      .from('marcas')
      .select('id')
      .eq('nombre', data.nombre)
      .maybeSingle();

    if (checkError) throw new AppError('Error al verificar marca', 500);
    if (existing) throw new AppError('Ya existe una marca con ese nombre', 409);

    const { data: marca, error } = await supabase
      .from('marcas')
      .insert({ nombre: data.nombre })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear marca: ${error.message}`, 500);
    return marca;
  }

  async editar(id: string, data: { nombre?: string }) {
    const { data: marca, error } = await supabase
      .from('marcas')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar marca: ${error.message}`, 500);
    if (!marca) throw new NotFoundError('Marca no encontrada');
    return marca;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data, error } = await supabase
      .from('marcas')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Marca no encontrada');
    return data;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('marcas')
      .update({ estado: 'eliminado', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar marca: ${error.message}`, 500);
    return { message: 'Marca eliminada' };
  }
}

export const marcasService = new MarcasService();
