import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class TrackingService {
  async getTracking(solicitudId: string) {
    const { data, error } = await supabase
      .from('solicitudes_tracking')
      .select('*')
      .eq('solicitud_id', solicitudId)
      .order('created_at', { ascending: true });

    if (error) throw new AppError('Error al obtener tracking', 500);
    return data;
  }

  async addEvento(
    solicitudId: string,
    estado: string,
    comentario?: string,
    usuarioId?: string,
    latitud?: string,
    longitud?: string,
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data, error } = await supabase
      .from('solicitudes_tracking')
      .insert({
        solicitud_id: solicitudId,
        estado,
        comentario: comentario || null,
        usuario_id: usuarioId || null,
        latitud: latitud || null,
        longitud: longitud || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar evento: ${error.message}`, 500);
    return data;
  }

  async getByCodigo(codigo: string) {
    const { data: solicitud, error: solicitudError } = await supabase
      .from('solicitudes')
      .select(`
        id, 
        estado, 
        codigo_seguimiento, 
        created_at,
        descripcion_problema,
        dispositivos(*, modelos(*, marcas(*))),
        clientes(*, usuarios(nombre, apellido, telefono))
      `)
      .eq('codigo_seguimiento', codigo)
      .single();

    if (solicitudError || !solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: tracking, error: trackingError } = await supabase
      .from('solicitudes_tracking')
      .select('*')
      .eq('solicitud_id', solicitud.id)
      .order('created_at', { ascending: true });

    if (trackingError) throw new AppError('Error al obtener tracking', 500);

    const { data: estados } = await supabase
      .from('estado_dispositivo')
      .select('*')
      .eq('solicitud_id', solicitud.id)
      .order('created_at', { ascending: true });

    const { data: observaciones } = await supabase
      .from('observaciones_solicitudes')
      .select('*, usuarios(nombre, apellido)')
      .eq('solicitud_id', solicitud.id)
      .order('created_at', { ascending: true });

    return {
      solicitud: {
        codigo: solicitud.codigo_seguimiento,
        estado: solicitud.estado,
        fecha_creacion: solicitud.created_at,
        problema: solicitud.descripcion_problema,
        dispositivo: solicitud.dispositivos,
        cliente: {
          nombre: (solicitud.clientes as any)?.[0]?.usuarios?.nombre,
          apellido: (solicitud.clientes as any)?.[0]?.usuarios?.apellido,
        },
      },
      eventos: tracking,
      estados_dispositivo: estados || [],
      observaciones: observaciones || [],
    };
  }

  async registrarUbicacion(solicitudId: string, latitud: string, longitud: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ latitud, longitud, updated_at: new Date().toISOString() })
      .eq('id', solicitudId)
      .select('id, latitud, longitud')
      .single();

    if (error) throw new AppError(`Error al registrar ubicacion: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');
    return data;
  }

  async getUbicacionActual(solicitudId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('id, latitud, longitud, updated_at')
      .eq('id', solicitudId)
      .single();

    if (error || !data) throw new NotFoundError('Solicitud no encontrada');
    return data;
  }

  async getRuta(solicitudId: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data, error } = await supabase
      .from('solicitudes_tracking')
      .select('id, latitud, longitud, created_at, estado')
      .eq('solicitud_id', solicitudId)
      .not('latitud', 'is', null)
      .not('longitud', 'is', null)
      .order('created_at', { ascending: true });

    if (error) throw new AppError('Error al obtener ruta', 500);
    return data;
  }
}

export const trackingService = new TrackingService();
