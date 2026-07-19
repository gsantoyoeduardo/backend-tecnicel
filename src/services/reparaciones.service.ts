import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ReparacionesService {
  async listar() {
    const { data, error } = await supabase
      .from('reparaciones')
      .select('*, solicitudes(*)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar reparaciones', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('reparaciones')
      .select('*, solicitudes(*), reparaciones_repuestos(*, productos(*)), reparaciones_evidencias(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Reparacion no encontrada');
    return data;
  }

  async iniciar(solicitudId: string, tecnicoId?: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: reparacion, error } = await supabase
      .from('reparaciones')
      .insert({
        solicitud_id: solicitudId,
        tecnico_id: tecnicoId || null,
        fecha_inicio: new Date().toISOString(),
        estado: 'en_progreso',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al iniciar reparacion: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'en_progreso',
      updated_at: new Date().toISOString(),
    }).eq('id', solicitudId);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitudId,
      estado: 'en_progreso',
      comentario: 'Reparacion iniciada',
    });

    return reparacion;
  }

  async actualizar(id: string, data: { observaciones?: string; tecnicoId?: string }) {
    const { data: existing } = await supabase
      .from('reparaciones')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Reparacion no encontrada');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;
    if (data.tecnicoId !== undefined) updateData.tecnico_id = data.tecnicoId;

    const { data: reparacion, error } = await supabase
      .from('reparaciones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar reparacion: ${error.message}`, 500);
    return reparacion;
  }

  async finalizar(id: string) {
    const { data: existing } = await supabase
      .from('reparaciones')
      .select('id, solicitud_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Reparacion no encontrada');

    const { data: reparacion, error } = await supabase
      .from('reparaciones')
      .update({
        fecha_fin: new Date().toISOString(),
        estado: 'finalizada',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al finalizar reparacion: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'en_control_calidad',
      updated_at: new Date().toISOString(),
    }).eq('id', existing.solicitud_id);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: existing.solicitud_id,
      estado: 'en_control_calidad',
      comentario: 'Reparacion finalizada, en espera de control de calidad',
    });

    return reparacion;
  }

  async agregarRepuesto(reparacionId: string, productoId: string, cantidad: number, precioUnitario: number) {
    const { data: reparacion } = await supabase
      .from('reparaciones')
      .select('id')
      .eq('id', reparacionId)
      .single();

    if (!reparacion) throw new NotFoundError('Reparacion no encontrada');

    const { data, error } = await supabase
      .from('reparaciones_repuestos')
      .insert({
        reparacion_id: reparacionId,
        producto_id: productoId,
        cantidad,
        precio_unitario: precioUnitario,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al agregar repuesto: ${error.message}`, 500);
    return data;
  }

  async quitarRepuesto(detalleId: string) {
    const { data: existing } = await supabase
      .from('reparaciones_repuestos')
      .select('id')
      .eq('id', detalleId)
      .single();

    if (!existing) throw new NotFoundError('Repuesto no encontrado');

    const { error } = await supabase
      .from('reparaciones_repuestos')
      .delete()
      .eq('id', detalleId);

    if (error) throw new AppError(`Error al quitar repuesto: ${error.message}`, 500);
    return { success: true };
  }

  async agregarEvidencia(reparacionId: string, urlArchivo: string, tipo?: string, descripcion?: string) {
    const { data: reparacion } = await supabase
      .from('reparaciones')
      .select('id')
      .eq('id', reparacionId)
      .single();

    if (!reparacion) throw new NotFoundError('Reparacion no encontrada');

    const { data, error } = await supabase
      .from('reparaciones_evidencias')
      .insert({
        reparacion_id: reparacionId,
        url_archivo: urlArchivo,
        tipo: tipo || null,
        descripcion: descripcion || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al agregar evidencia: ${error.message}`, 500);
    return data;
  }

  async registrarControlCalidad(
    reparacionId: string,
    data: { pruebasRealizadas: string; resultado: string; observaciones?: string; tecnicoId?: string },
  ) {
    const { data: reparacion } = await supabase
      .from('reparaciones')
      .select('id, solicitud_id')
      .eq('id', reparacionId)
      .single();

    if (!reparacion) throw new NotFoundError('Reparacion no encontrada');

    const { data: control, error } = await supabase
      .from('control_calidad')
      .insert({
        reparacion_id: reparacionId,
        pruebas_realizadas: data.pruebasRealizadas,
        resultado: data.resultado,
        observaciones: data.observaciones || null,
        tecnico_id: data.tecnicoId || null,
        fecha_control: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar control de calidad: ${error.message}`, 500);

    if (data.resultado === 'aprobado') {
      await supabase.from('solicitudes').update({
        estado: 'listo_para_entrega',
        updated_at: new Date().toISOString(),
      }).eq('id', reparacion.solicitud_id);

      await supabase.from('solicitudes_tracking').insert({
        solicitud_id: reparacion.solicitud_id,
        estado: 'listo_para_entrega',
        comentario: 'Control de calidad aprobado, listo para entrega',
      });
    }

    return control;
  }
}

export const reparacionesService = new ReparacionesService();
