import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ServiciosModelosService {
  async listar() {
    const { data, error } = await supabase
      .from('servicios_modelos')
      .select('*, servicios(*), modelos(*, marcas(*))')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar servicios por modelo', 500);
    return data;
  }

  async listarPorModelo(modeloId: string) {
    const { data, error } = await supabase
      .from('servicios_modelos')
      .select('*, servicios(*)')
      .eq('modelo_id', modeloId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar servicios del modelo', 500);
    return data;
  }

  async crear(data: {
    modelo_id: string;
    servicio_id: string;
    precio_estimado?: number;
    duracion_estimada_minutos?: number;
    permite_domicilio?: boolean;
    permite_recojo?: boolean;
    permite_sucursal?: boolean;
  }) {
    const { data: existing, error: checkError } = await supabase
      .from('servicios_modelos')
      .select('id')
      .eq('modelo_id', data.modelo_id)
      .eq('servicio_id', data.servicio_id)
      .maybeSingle();

    if (checkError) throw new AppError('Error al verificar servicio-modelo', 500);
    if (existing) throw new AppError('Este servicio ya esta asignado a ese modelo', 409);

    const { data: servicioModelo, error } = await supabase
      .from('servicios_modelos')
      .insert({
        modelo_id: data.modelo_id,
        servicio_id: data.servicio_id,
        precio_estimado: data.precio_estimado ?? null,
        duracion_estimada_minutos: data.duracion_estimada_minutos ?? null,
        permite_domicilio: data.permite_domicilio ?? true,
        permite_recojo: data.permite_recojo ?? true,
        permite_sucursal: data.permite_sucursal ?? true,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear servicio-modelo: ${error.message}`, 500);
    return servicioModelo;
  }

  async editar(
    id: string,
    data: {
      precio_estimado?: number;
      duracion_estimada_minutos?: number;
      permite_domicilio?: boolean;
      permite_recojo?: boolean;
      permite_sucursal?: boolean;
    },
  ) {
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.precio_estimado !== undefined) updateData.precio_estimado = data.precio_estimado;
    if (data.duracion_estimada_minutos !== undefined) updateData.duracion_estimada_minutos = data.duracion_estimada_minutos;
    if (data.permite_domicilio !== undefined) updateData.permite_domicilio = data.permite_domicilio;
    if (data.permite_recojo !== undefined) updateData.permite_recojo = data.permite_recojo;
    if (data.permite_sucursal !== undefined) updateData.permite_sucursal = data.permite_sucursal;

    const { data: servicioModelo, error } = await supabase
      .from('servicios_modelos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar servicio-modelo: ${error.message}`, 500);
    if (!servicioModelo) throw new NotFoundError('Asignacion servicio-modelo no encontrada');
    return servicioModelo;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('servicios_modelos')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar servicio-modelo: ${error.message}`, 500);
    return { message: 'Asignacion servicio-modelo eliminada' };
  }

  async eliminarPorModeloServicio(modeloId: string, servicioId: string) {
    const { error } = await supabase
      .from('servicios_modelos')
      .delete()
      .eq('modelo_id', modeloId)
      .eq('servicio_id', servicioId);

    if (error) throw new AppError(`Error al eliminar servicio-modelo: ${error.message}`, 500);
    return { message: 'Asignacion servicio-modelo eliminada' };
  }
}

export const serviciosModelosService = new ServiciosModelosService();
