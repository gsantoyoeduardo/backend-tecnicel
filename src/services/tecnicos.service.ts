import { supabase } from '../config/supabase';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';

export class TecnicosService {
  async listar() {
    const { data, error } = await supabase
      .from('tecnicos')
      .select('*, usuarios!inner(id, email, nombre, apellido, telefono, estado, rol_id, roles(nombre))')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar tecnicos', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('tecnicos')
      .select('*, usuarios!inner(id, email, nombre, apellido, telefono, estado, rol_id, roles(nombre))')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Tecnico no encontrado');
    return data;
  }

  async crear(data: { usuarioId: string; especialidad?: string; experienciaAnios?: number }) {
    const { data: existing } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('usuario_id', data.usuarioId)
      .maybeSingle();

    if (existing) throw new AppError('El usuario ya tiene un perfil de tecnico', 409);

    const { data: tecnico, error } = await supabase
      .from('tecnicos')
      .insert({
        usuario_id: data.usuarioId,
        especialidad: data.especialidad || null,
        experiencia_anios: data.experienciaAnios || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear tecnico: ${error.message}`, 500);
    return tecnico;
  }

  async editar(id: string, data: { especialidad?: string; experienciaAnios?: number; estado?: string }) {
    const { data: existing } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Tecnico no encontrado');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.especialidad !== undefined) updateData.especialidad = data.especialidad;
    if (data.experienciaAnios !== undefined) updateData.experiencia_anios = data.experienciaAnios;
    if (data.estado !== undefined) updateData.estado = data.estado;

    const { data: tecnico, error } = await supabase
      .from('tecnicos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar tecnico: ${error.message}`, 500);
    return tecnico;
  }

  async getServicios(tecnicoId: string) {
    const { data: tecnico } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('id', tecnicoId)
      .single();

    if (!tecnico) throw new NotFoundError('Tecnico no encontrado');

    const { data, error } = await supabase
      .from('tecnicos_servicios')
      .select('*, servicios(*)')
      .eq('tecnico_id', tecnicoId);

    if (error) throw new AppError('Error al obtener servicios', 500);
    return data;
  }

  async asignarServicios(tecnicoId: string, servicioIds: string[]) {
    const { data: tecnico } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('id', tecnicoId)
      .single();

    if (!tecnico) throw new NotFoundError('Tecnico no encontrado');

    await supabase.from('tecnicos_servicios').delete().eq('tecnico_id', tecnicoId);

    if (servicioIds.length > 0) {
      const rows = servicioIds.map((servicioId) => ({
        tecnico_id: tecnicoId,
        servicio_id: servicioId,
      }));

      const { error } = await supabase.from('tecnicos_servicios').insert(rows);

      if (error) throw new AppError(`Error al asignar servicios: ${error.message}`, 500);
    }

    const { data, error } = await supabase
      .from('tecnicos_servicios')
      .select('*, servicios(*)')
      .eq('tecnico_id', tecnicoId);

    if (error) throw new AppError('Error al obtener servicios asignados', 500);
    return data;
  }

  async getDisponibilidad(tecnicoId: string) {
    const { data: tecnico } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('id', tecnicoId)
      .single();

    if (!tecnico) throw new NotFoundError('Tecnico no encontrado');

    const { data, error } = await supabase
      .from('reparaciones')
      .select('id, solicitud_id, estado, fecha_inicio')
      .eq('tecnico_id', tecnicoId)
      .in('estado', ['en_progreso', 'pendiente'])
      .order('fecha_inicio', { ascending: false });

    if (error) throw new AppError('Error al obtener disponibilidad', 500);

    return {
      disponible: !data || data.length === 0,
      reparaciones_activas: data || [],
    };
  }

  async getAsignaciones(tecnicoId: string) {
    const { data: tecnico } = await supabase
      .from('tecnicos')
      .select('id')
      .eq('id', tecnicoId)
      .single();

    if (!tecnico) throw new NotFoundError('Tecnico no encontrado');

    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*, modelos(*, marcas(*)))')
      .eq('tecnico_id', tecnicoId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener asignaciones', 500);
    return data;
  }

  private async getTecnicoIdFromUsuario(usuarioId: string): Promise<string> {
    const { data: tecnico, error } = await supabase
      .from('tecnicos')
      .select('id, usuario_id')
      .eq('usuario_id', usuarioId)
      .single();

    if (error || !tecnico) throw new ForbiddenError('Perfil de tecnico no encontrado');
    return tecnico.id;
  }

  async misServicios(usuarioId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*, modelos(*, marcas(*)))')
      .eq('tecnico_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener servicios', 500);
    return data;
  }

  async iniciarAtencion(solicitudId: string, usuarioId: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id, estado')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
    if (solicitud.tecnico_id !== usuarioId) throw new ForbiddenError('Esta solicitud no esta asignada a este tecnico');

    const { data: reparacion, error } = await supabase
      .from('reparaciones')
      .insert({
        solicitud_id: solicitudId,
        tecnico_id: usuarioId,
        fecha_inicio: new Date().toISOString(),
        estado: 'en_progreso',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al iniciar atencion: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'en_progreso',
      updated_at: new Date().toISOString(),
    }).eq('id', solicitudId);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitudId,
      estado: 'en_progreso',
      comentario: 'Tecnico inicio atencion',
      usuario_id: usuarioId,
    });

    return reparacion;
  }

  async cambiarEstado(solicitudId: string, usuarioId: string, estado: string, comentario?: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id, estado')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
    if (solicitud.tecnico_id !== usuarioId) throw new ForbiddenError('Esta solicitud no esta asignada a este tecnico');

    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', solicitudId)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitudId,
      estado,
      comentario: comentario || null,
      usuario_id: usuarioId,
    });

    return data;
  }

  async registrarDiagnostico(
    solicitudId: string,
    usuarioId: string,
    data: { descripcion: string; diagnostico?: string; observaciones?: string },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
    if (solicitud.tecnico_id !== usuarioId) throw new ForbiddenError('Esta solicitud no esta asignada a este tecnico');

    const { data: diagnostico, error } = await supabase
      .from('diagnosticos')
      .insert({
        solicitud_id: solicitudId,
        tecnico_id: usuarioId,
        problema_detectado: data.descripcion,
        solucion_propuesta: data.diagnostico || '',
        observaciones: data.observaciones || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar diagnostico: ${error.message}`, 500);
    return diagnostico;
  }

  async subirEvidencias(solicitudId: string, usuarioId: string, urlArchivo: string, tipo?: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
    if (solicitud.tecnico_id !== usuarioId) throw new ForbiddenError('Esta solicitud no esta asignada a este tecnico');

    const { data: reparacion } = await supabase
      .from('reparaciones')
      .select('id, tecnico_id')
      .eq('solicitud_id', solicitudId)
      .eq('tecnico_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!reparacion) throw new NotFoundError('Reparacion no encontrada para esta solicitud');

    const { data, error } = await supabase
      .from('reparaciones_evidencias')
      .insert({
        reparacion_id: reparacion.id,
        url_archivo: urlArchivo,
        tipo: tipo || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al subir evidencia: ${error.message}`, 500);
    return data;
  }

  async finalizarAtencion(solicitudId: string, usuarioId: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');
    if (solicitud.tecnico_id !== usuarioId) throw new ForbiddenError('Esta solicitud no esta asignada a este tecnico');

    const { data: reparacion } = await supabase
      .from('reparaciones')
      .select('id, tecnico_id, estado')
      .eq('solicitud_id', solicitudId)
      .eq('tecnico_id', usuarioId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!reparacion) throw new NotFoundError('Reparacion no encontrada para esta solicitud');

    const { data, error } = await supabase
      .from('reparaciones')
      .update({
        fecha_fin: new Date().toISOString(),
        estado: 'finalizada',
        updated_at: new Date().toISOString(),
      })
      .eq('id', reparacion.id)
      .select()
      .single();

    if (error) throw new AppError(`Error al finalizar atencion: ${error.message}`, 500);

    await supabase.from('solicitudes').update({
      estado: 'en_control_calidad',
      updated_at: new Date().toISOString(),
    }).eq('id', solicitudId);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitudId,
      estado: 'en_control_calidad',
      comentario: 'Reparacion finalizada, en espera de control de calidad',
      usuario_id: usuarioId,
    });

    return data;
  }

  async misOrdenes(usuarioId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select(`
        *,
        orden_dispositivos(*, orden_servicios(*, servicios(*))),
        clientes(*, usuarios(nombre, apellido, telefono, email))
      `)
      .eq('tecnico_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener ordenes', 500);
    return data;
  }

  async registrarEstadoInicial(
    ordenId: string,
    dispositivoId: string,
    data: {
      estado_general?: string;
      bateria?: number;
      accesorios?: string[];
      fotos?: string[];
      notas?: string;
    },
    usuarioId: string
  ) {
    const { data: orden } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id')
      .eq('id', ordenId)
      .single();

    if (!orden) throw new NotFoundError('Orden no encontrada');
    if (orden.tecnico_id !== usuarioId) throw new ForbiddenError('No estás asignado a esta orden');

    const { data: dispositivo, error } = await supabase
      .from('orden_dispositivos')
      .update({
        estado_inicial: data.estado_general || null,
        bateria: data.bateria || null,
        accesorios: data.accesorios || [],
        fotos: data.fotos || [],
        notas: data.notas || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', dispositivoId)
      .eq('orden_id', ordenId)
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar estado inicial: ${error.message}`, 500);
    if (!dispositivo) throw new NotFoundError('Dispositivo no encontrado');

    return dispositivo;
  }
}

export const tecnicosService = new TecnicosService();
