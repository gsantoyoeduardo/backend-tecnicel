import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ModelosService {
  async listar(filtros?: { marcaId?: string; buscar?: string; estado?: string }) {
    let query = supabase
      .from('modelos')
      .select('*, marcas(nombre)')
      .order('nombre', { ascending: true });

    if (filtros?.marcaId) {
      query = query.eq('marca_id', filtros.marcaId);
    }

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado);
    }

    if (filtros?.buscar) {
      query = query.ilike('nombre', `%${filtros.buscar}%`);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al listar modelos', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('modelos')
      .select('*, marcas(nombre)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Modelo no encontrado');
    return data;
  }

  async listarPorMarca(marcaId: string) {
    const { data, error } = await supabase
      .from('modelos')
      .select('*')
      .eq('marca_id', marcaId)
      .eq('estado', 'activo')
      .order('nombre', { ascending: true });

    if (error) throw new AppError('Error al listar modelos por marca', 500);
    return data;
  }

  async crear(data: { marcaId: string; nombre: string; anio?: string }) {
    const { data: modelo, error } = await supabase
      .from('modelos')
      .insert({
        marca_id: data.marcaId,
        nombre: data.nombre,
        anio: data.anio || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear modelo: ${error.message}`, 500);
    return modelo;
  }

  async editar(id: string, data: { marcaId?: string; nombre?: string; anio?: string }) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.marcaId !== undefined) updateData.marca_id = data.marcaId;
    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.anio !== undefined) updateData.anio = data.anio;

    const { data: modelo, error } = await supabase
      .from('modelos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar modelo: ${error.message}`, 500);
    if (!modelo) throw new NotFoundError('Modelo no encontrado');
    return modelo;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data, error } = await supabase
      .from('modelos')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Modelo no encontrado');
    return data;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('modelos')
      .update({ estado: 'eliminado', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar modelo: ${error.message}`, 500);
    return { message: 'Modelo eliminado' };
  }
}

export const modelosService = new ModelosService();
