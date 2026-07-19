import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class EstadoDispositivoService {
  async crear(
    solicitudId: string,
    data: {
      tipo: 'ingreso' | 'salida';
      estado_general?: string;
      pantalla_estado?: string;
      carcasa_estado?: string;
      botones_estado?: string;
      camara_estado?: string;
      audio_estado?: string;
      carga_bateria?: number;
      accesorios_entregados?: string[];
      fotos?: string[];
      observaciones?: string;
      observaciones_adicionales?: string;
      tecnico_id: string;
    }
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: existing } = await supabase
      .from('estado_dispositivo')
      .select('id')
      .eq('solicitud_id', solicitudId)
      .eq('tipo', data.tipo)
      .maybeSingle();

    if (existing) {
      throw new AppError(`Ya existe un estado de ${data.tipo} para esta solicitud`, 400);
    }

    const { data: estado, error } = await supabase
      .from('estado_dispositivo')
      .insert({
        solicitud_id: solicitudId,
        tipo: data.tipo,
        estado_general: data.estado_general || null,
        pantalla_estado: data.pantalla_estado || null,
        carcasa_estado: data.carcasa_estado || null,
        botones_estado: data.botones_estado || null,
        camara_estado: data.camara_estado || null,
        audio_estado: data.audio_estado || null,
        carga_bateria: data.carga_bateria || null,
        accesorios_entregados: data.accesorios_entregados || [],
        fotos: data.fotos || [],
        observaciones: data.observaciones || null,
        observaciones_adicionales: data.observaciones_adicionales || null,
        tecnico_id: data.tecnico_id,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear estado: ${error.message}`, 500);
    return estado;
  }

  async obtenerPorSolicitud(solicitudId: string) {
    const { data, error } = await supabase
      .from('estado_dispositivo')
      .select('*, usuarios(nombre, apellido)')
      .eq('solicitud_id', solicitudId)
      .order('created_at', { ascending: true });

    if (error) throw new AppError('Error al obtener estados', 500);
    return data;
  }

  async obtenerPorTipo(solicitudId: string, tipo: 'ingreso' | 'salida') {
    const { data, error } = await supabase
      .from('estado_dispositivo')
      .select('*, usuarios(nombre, apellido)')
      .eq('solicitud_id', solicitudId)
      .eq('tipo', tipo)
      .single();

    if (error) throw new NotFoundError(`Estado de ${tipo} no encontrado`);
    return data;
  }

  async actualizar(
    solicitudId: string,
    tipo: 'ingreso' | 'salida',
    data: {
      estado_general?: string;
      pantalla_estado?: string;
      carcasa_estado?: string;
      botones_estado?: string;
      camara_estado?: string;
      audio_estado?: string;
      carga_bateria?: number;
      accesorios_entregados?: string[];
      fotos?: string[];
      observaciones?: string;
      observaciones_adicionales?: string;
    }
  ) {
    const { data: existing } = await supabase
      .from('estado_dispositivo')
      .select('id')
      .eq('solicitud_id', solicitudId)
      .eq('tipo', tipo)
      .maybeSingle();

    if (!existing) throw new NotFoundError(`Estado de ${tipo} no encontrado`);

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.estado_general !== undefined) updateData.estado_general = data.estado_general;
    if (data.pantalla_estado !== undefined) updateData.pantalla_estado = data.pantalla_estado;
    if (data.carcasa_estado !== undefined) updateData.carcasa_estado = data.carcasa_estado;
    if (data.botones_estado !== undefined) updateData.botones_estado = data.botones_estado;
    if (data.camara_estado !== undefined) updateData.camara_estado = data.camara_estado;
    if (data.audio_estado !== undefined) updateData.audio_estado = data.audio_estado;
    if (data.carga_bateria !== undefined) updateData.carga_bateria = data.carga_bateria;
    if (data.accesorios_entregados !== undefined) updateData.accesorios_entregados = data.accesorios_entregados;
    if (data.fotos !== undefined) updateData.fotos = data.fotos;
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;
    if (data.observaciones_adicionales !== undefined) updateData.observaciones_adicionales = data.observaciones_adicionales;

    const { data: estado, error } = await supabase
      .from('estado_dispositivo')
      .update(updateData)
      .eq('solicitud_id', solicitudId)
      .eq('tipo', tipo)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar estado: ${error.message}`, 500);
    return estado;
  }
}

export const estadoDispositivoService = new EstadoDispositivoService();
