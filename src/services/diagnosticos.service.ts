import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class DiagnosticosService {
  async getBySolicitud(solicitudId: string) {
    const { data, error } = await supabase
      .from('diagnosticos')
      .select('*, diagnosticos_evidencias(*)')
      .eq('solicitud_id', solicitudId)
      .order('created_at', { ascending: false })
      .single();

    if (error) throw new AppError('Error al obtener diagnostico', 500);
    return data;
  }

  async crear(
    solicitudId: string,
    data: {
      problemaDetectado: string;
      solucionPropuesta: string;
      observaciones?: string;
      requiereRepuesto?: boolean;
      tecnicoId?: string;
    },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: diagnostico, error } = await supabase
      .from('diagnosticos')
      .insert({
        solicitud_id: solicitudId,
        problema_detectado: data.problemaDetectado,
        solucion_propuesta: data.solucionPropuesta,
        observaciones: data.observaciones || null,
        requiere_repuesto: data.requiereRepuesto || false,
        tecnico_id: data.tecnicoId || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear diagnostico: ${error.message}`, 500);
    return diagnostico;
  }

  async actualizar(
    id: string,
    data: {
      problemaDetectado?: string;
      solucionPropuesta?: string;
      observaciones?: string;
      requiereRepuesto?: boolean;
      tecnicoId?: string;
    },
  ) {
    const { data: existing } = await supabase
      .from('diagnosticos')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Diagnostico no encontrado');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.problemaDetectado !== undefined) updateData.problema_detectado = data.problemaDetectado;
    if (data.solucionPropuesta !== undefined) updateData.solucion_propuesta = data.solucionPropuesta;
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;
    if (data.requiereRepuesto !== undefined) updateData.requiere_repuesto = data.requiereRepuesto;
    if (data.tecnicoId !== undefined) updateData.tecnico_id = data.tecnicoId;

    const { data: diagnostico, error } = await supabase
      .from('diagnosticos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar diagnostico: ${error.message}`, 500);
    return diagnostico;
  }

  async addEvidencia(
    diagnosticoId: string,
    urlArchivo: string,
    tipo?: string,
    descripcion?: string,
  ) {
    const { data: diagnostico } = await supabase
      .from('diagnosticos')
      .select('id')
      .eq('id', diagnosticoId)
      .single();

    if (!diagnostico) throw new NotFoundError('Diagnostico no encontrado');

    const { data, error } = await supabase
      .from('diagnosticos_evidencias')
      .insert({
        diagnostico_id: diagnosticoId,
        url_archivo: urlArchivo,
        tipo: tipo || null,
        descripcion: descripcion || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al agregar evidencia: ${error.message}`, 500);
    return data;
  }

  async deleteEvidencia(evidenciaId: string) {
    const { data: existing } = await supabase
      .from('diagnosticos_evidencias')
      .select('id')
      .eq('id', evidenciaId)
      .single();

    if (!existing) throw new NotFoundError('Evidencia no encontrada');

    const { error } = await supabase
      .from('diagnosticos_evidencias')
      .delete()
      .eq('id', evidenciaId);

    if (error) throw new AppError(`Error al eliminar evidencia: ${error.message}`, 500);
    return { success: true };
  }
}

export const diagnosticosService = new DiagnosticosService();
