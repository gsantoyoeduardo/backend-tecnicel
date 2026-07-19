import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ServiciosService {
  async listar() {
    const { data, error } = await supabase
      .from('servicios')
      .select('*, categorias_servicio(nombre)')
      .order('nombre', { ascending: true });

    if (error) throw new AppError('Error al listar servicios', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('servicios')
      .select('*, categorias_servicio(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Servicio no encontrado');
    return data;
  }

  async crear(data: {
    nombre: string;
    categoria_id?: string;
    descripcion?: string;
    precio_base?: number;
    duracion_estimada_minutos?: number;
    permite_domicilio?: boolean;
    permite_recojo?: boolean;
    permite_sucursal?: boolean;
  }) {
    const { data: existing, error: checkError } = await supabase
      .from('servicios')
      .select('id')
      .eq('nombre', data.nombre)
      .maybeSingle();

    if (checkError) throw new AppError('Error al verificar servicio', 500);
    if (existing) throw new AppError('Ya existe un servicio con ese nombre', 409);

    const { data: servicio, error } = await supabase
      .from('servicios')
      .insert({
        nombre: data.nombre,
        categoria_id: data.categoria_id || null,
        descripcion: data.descripcion || null,
        precio_base: data.precio_base ?? null,
        duracion_estimada_minutos: data.duracion_estimada_minutos ?? null,
        permite_domicilio: data.permite_domicilio ?? true,
        permite_recojo: data.permite_recojo ?? true,
        permite_sucursal: data.permite_sucursal ?? true,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear servicio: ${error.message}`, 500);
    return servicio;
  }

  async editar(
    id: string,
    data: {
      nombre?: string;
      categoria_id?: string;
      descripcion?: string;
      precio_base?: number;
      duracion_estimada_minutos?: number;
      permite_domicilio?: boolean;
      permite_recojo?: boolean;
      permite_sucursal?: boolean;
    },
  ) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.categoria_id !== undefined) updateData.categoria_id = data.categoria_id;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.precio_base !== undefined) updateData.precio_base = data.precio_base;
    if (data.duracion_estimada_minutos !== undefined) updateData.duracion_estimada_minutos = data.duracion_estimada_minutos;
    if (data.permite_domicilio !== undefined) updateData.permite_domicilio = data.permite_domicilio;
    if (data.permite_recojo !== undefined) updateData.permite_recojo = data.permite_recojo;
    if (data.permite_sucursal !== undefined) updateData.permite_sucursal = data.permite_sucursal;

    const { data: servicio, error } = await supabase
      .from('servicios')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar servicio: ${error.message}`, 500);
    if (!servicio) throw new NotFoundError('Servicio no encontrado');
    return servicio;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data, error } = await supabase
      .from('servicios')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Servicio no encontrado');
    return data;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('servicios')
      .update({ estado: 'eliminado', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar servicio: ${error.message}`, 500);
    return { message: 'Servicio eliminado' };
  }
}

export const serviciosService = new ServiciosService();
