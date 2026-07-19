import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class TransportesService {
  async listar() {
    const { data, error } = await supabase
      .from('transportes')
      .select('*, solicitudes(*), repartidores:usuarios!transportes_repartidor_id_fkey(id, nombre, apellido, email)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar transportes', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('transportes')
      .select('*, solicitudes(*), repartidores:usuarios!transportes_repartidor_id_fkey(id, nombre, apellido, email)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Transporte no encontrado');
    return data;
  }

  async programarRecojo(
    solicitudId: string,
    data: { repartidorId?: string; fechaProgramada?: string; direccionRecogida?: string },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: transporte, error } = await supabase
      .from('transportes')
      .insert({
        solicitud_id: solicitudId,
        repartidor_id: data.repartidorId || null,
        tipo: 'recojo',
        fecha_programada: data.fechaProgramada || null,
        direccion_recogida: data.direccionRecogida || null,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al programar recojo: ${error.message}`, 500);
    return transporte;
  }

  async programarEntrega(
    solicitudId: string,
    data: { repartidorId?: string; fechaProgramada?: string; direccionEntrega?: string },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: transporte, error } = await supabase
      .from('transportes')
      .insert({
        solicitud_id: solicitudId,
        repartidor_id: data.repartidorId || null,
        tipo: 'entrega',
        fecha_programada: data.fechaProgramada || null,
        direccion_entrega: data.direccionEntrega || null,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al programar entrega: ${error.message}`, 500);
    return transporte;
  }

  async editar(id: string, data: {
    repartidorId?: string;
    fechaProgramada?: string;
    direccionRecogida?: string;
    direccionEntrega?: string;
  }) {
    const { data: existing } = await supabase
      .from('transportes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Transporte no encontrado');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.repartidorId !== undefined) updateData.repartidor_id = data.repartidorId;
    if (data.fechaProgramada !== undefined) updateData.fecha_programada = data.fechaProgramada;
    if (data.direccionRecogida !== undefined) updateData.direccion_recogida = data.direccionRecogida;
    if (data.direccionEntrega !== undefined) updateData.direccion_entrega = data.direccionEntrega;

    const { data: transporte, error } = await supabase
      .from('transportes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar transporte: ${error.message}`, 500);
    return transporte;
  }

  async iniciar(id: string) {
    const { data: existing } = await supabase
      .from('transportes')
      .select('id, solicitud_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Transporte no encontrado');

    const { data, error } = await supabase
      .from('transportes')
      .update({ estado: 'en_camino', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al iniciar transporte: ${error.message}`, 500);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: existing.solicitud_id,
      estado: 'en_camino',
      comentario: 'Transporte en camino',
    });

    return data;
  }

  async confirmarRecojo(id: string) {
    const { data: existing } = await supabase
      .from('transportes')
      .select('id, solicitud_id, tipo')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Transporte no encontrado');
    if (existing.tipo !== 'recojo') throw new AppError('Este transporte no es de tipo recojo', 400);

    const { data, error } = await supabase
      .from('transportes')
      .update({ estado: 'completado', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al confirmar recojo: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'equipo_recogido',
      updated_at: new Date().toISOString(),
    }).eq('id', existing.solicitud_id);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: existing.solicitud_id,
      estado: 'equipo_recogido',
      comentario: 'Equipo recogido por el repartidor',
    });

    return data;
  }

  async confirmarEntrega(id: string) {
    const { data: existing } = await supabase
      .from('transportes')
      .select('id, solicitud_id, tipo')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Transporte no encontrado');
    if (existing.tipo !== 'entrega') throw new AppError('Este transporte no es de tipo entrega', 400);

    const { data, error } = await supabase
      .from('transportes')
      .update({ estado: 'completado', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al confirmar entrega: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'entregado',
      updated_at: new Date().toISOString(),
    }).eq('id', existing.solicitud_id);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: existing.solicitud_id,
      estado: 'entregado',
      comentario: 'Equipo entregado al cliente',
    });

    return data;
  }

  async enviarUbicacion(id: string, latitud: string, longitud: string) {
    const { data: existing } = await supabase
      .from('transportes')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Transporte no encontrado');

    const { data, error } = await supabase
      .from('transportes')
      .update({ latitud, longitud, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, latitud, longitud, updated_at')
      .single();

    if (error) throw new AppError(`Error al enviar ubicacion: ${error.message}`, 500);
    return data;
  }

  async getUbicacion(id: string) {
    const { data, error } = await supabase
      .from('transportes')
      .select('id, latitud, longitud, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Transporte no encontrado');
    return data;
  }
}

export const transportesService = new TransportesService();
