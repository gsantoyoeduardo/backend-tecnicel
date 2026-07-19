import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class CalificacionesService {
  async calificar(
    solicitudId: string,
    clienteId: string,
    calificacion: number,
    comentario?: string,
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data, error } = await supabase
      .from('calificaciones')
      .insert({
        solicitud_id: solicitudId,
        cliente_id: clienteId,
        calificacion,
        comentario: comentario || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al calificar: ${error.message}`, 500);
    return data;
  }

  async listar() {
    const { data, error } = await supabase
      .from('calificaciones')
      .select('*, solicitudes(*, servicios(*))')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar calificaciones', 500);
    return data;
  }

  async crearReclamo(
    solicitudId: string,
    clienteId: string,
    data: {
      motivo: string;
      descripcion: string;
    },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: reclamo, error } = await supabase
      .from('reclamos')
      .insert({
        solicitud_id: solicitudId,
        cliente_id: clienteId,
        motivo: data.motivo,
        descripcion: data.descripcion,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear reclamo: ${error.message}`, 500);
    return reclamo;
  }

  async listarReclamos() {
    const { data, error } = await supabase
      .from('reclamos')
      .select('*, solicitudes(*, servicios(*))')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar reclamos', 500);
    return data;
  }

  async getReclamo(id: string) {
    const { data, error } = await supabase
      .from('reclamos')
      .select('*, solicitudes(*, servicios(*))')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Reclamo no encontrado');
    return data;
  }

  async actualizarEstadoReclamo(
    id: string,
    data: {
      estado: string;
      respuesta?: string;
    },
  ) {
    const updateData: Record<string, unknown> = {
      estado: data.estado,
      updated_at: new Date().toISOString(),
    };

    if (data.respuesta !== undefined) updateData.respuesta = data.respuesta;

    const { data: reclamo, error } = await supabase
      .from('reclamos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar reclamo: ${error.message}`, 500);
    if (!reclamo) throw new NotFoundError('Reclamo no encontrado');
    return reclamo;
  }
}

export const calificacionesService = new CalificacionesService();
