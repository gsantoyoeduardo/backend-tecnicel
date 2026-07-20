import { supabase } from '../config/supabase';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';
import { generateTrackingCode } from '../utils/helpers';

const ESTADOS_CANCELABLES_POR_CLIENTE = ['solicitud_registrada'];

export class SolicitudesService {
  async misSolicitudes(clienteId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*)')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar solicitudes', 500);
    return data;
  }

  async obtenerSolicitudCliente(id: string, clienteId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*, modelos(*, marcas(*)))')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Solicitud no encontrada');
    if (data.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a esta solicitud');

    return data;
  }

  async crear(
    clienteId: string,
    data: {
      dispositivo_id: string;
      servicio_id: string;
      descripcion_problema?: string;
      modalidad: string;
      direccion_id?: string;
      sucursal_id?: string;
      fecha_preferida?: string;
      horario_preferido?: string;
    },
  ) {
    const { data: dispositivo } = await supabase
      .from('dispositivos')
      .select('id, cliente_id')
      .eq('id', data.dispositivo_id)
      .single();

    if (!dispositivo) throw new NotFoundError('Dispositivo no encontrado');
    if (dispositivo.cliente_id !== clienteId) throw new ForbiddenError('Este dispositivo no te pertenece');

    const codigoSeguimiento = generateTrackingCode();

    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .insert({
        cliente_id: clienteId,
        dispositivo_id: data.dispositivo_id,
        servicio_id: data.servicio_id,
        descripcion_problema: data.descripcion_problema || null,
        modalidad: data.modalidad,
        direccion_id: data.direccion_id || null,
        sucursal_id: data.sucursal_id || null,
        fecha_preferida: data.fecha_preferida || null,
        horario_preferido: data.horario_preferido || null,
        estado: 'solicitud_registrada',
        codigo_seguimiento: codigoSeguimiento,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear solicitud: ${error.message}`, 500);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitud.id,
      estado: 'solicitud_registrada',
      comentario: 'Solicitud registrada',
    });

    return solicitud;
  }

  async editar(
    id: string,
    clienteId: string,
    data: {
      dispositivo_id?: string;
      servicio_id?: string;
      descripcion_problema?: string;
      modalidad?: string;
      direccion_id?: string;
      sucursal_id?: string;
      fecha_preferida?: string;
      horario_preferido?: string;
    },
  ) {
    const { data: existing } = await supabase
      .from('solicitudes')
      .select('id, cliente_id, estado')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Solicitud no encontrada');
    if (existing.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a esta solicitud');
    if (existing.estado !== 'solicitud_registrada') {
      throw new AppError('Solo se pueden editar solicitudes en estado registrado', 400);
    }

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.dispositivo_id !== undefined) updateData.dispositivo_id = data.dispositivo_id;
    if (data.servicio_id !== undefined) updateData.servicio_id = data.servicio_id;
    if (data.descripcion_problema !== undefined) updateData.descripcion_problema = data.descripcion_problema;
    if (data.modalidad !== undefined) updateData.modalidad = data.modalidad;
    if (data.direccion_id !== undefined) updateData.direccion_id = data.direccion_id;
    if (data.sucursal_id !== undefined) updateData.sucursal_id = data.sucursal_id;
    if (data.fecha_preferida !== undefined) updateData.fecha_preferida = data.fecha_preferida;
    if (data.horario_preferido !== undefined) updateData.horario_preferido = data.horario_preferido;

    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar solicitud: ${error.message}`, 500);
    return solicitud;
  }

  async cancelarCliente(id: string, clienteId: string) {
    const { data: existing } = await supabase
      .from('solicitudes')
      .select('id, cliente_id, estado')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Solicitud no encontrada');
    if (existing.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a esta solicitud');
    if (!ESTADOS_CANCELABLES_POR_CLIENTE.includes(existing.estado)) {
      throw new AppError('No se puede cancelar una solicitud en este estado', 400);
    }

    const { data: solicitud, error } = await supabase
      .from('solicitudes')
      .update({ estado: 'cancelado_cliente', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cancelar solicitud: ${error.message}`, 500);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado: 'cancelado_cliente',
      comentario: 'Solicitud cancelada por el cliente',
    });

    return solicitud;
  }

  async listarTodas(filtros?: { estado?: string; modalidad?: string }) {
    let query = supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*, modelos(*, marcas(*))), clientes(*, usuarios(*))')
      .order('created_at', { ascending: false });

    if (filtros?.estado) {
      query = query.eq('estado', filtros.estado);
    }

    if (filtros?.modalidad) {
      query = query.eq('modalidad', filtros.modalidad);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al listar solicitudes', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*, servicios(*), dispositivos(*, modelos(*, marcas(*))), clientes(*, usuarios(*)), direcciones(*), sucursales(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Solicitud no encontrada');
    return data;
  }

  async confirmar(id: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado: 'solicitud_confirmada', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al confirmar solicitud: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado: 'solicitud_confirmada',
      comentario: 'Solicitud confirmada',
    });

    return data;
  }

  async asignarTecnico(id: string, tecnicoId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ tecnico_id: tecnicoId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al asignar tecnico: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado: data.estado,
      comentario: 'Tecnico asignado',
      usuario_id: tecnicoId,
    });

    return data;
  }

  async asignarRepartidor(id: string, repartidorId: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ repartidor_id: repartidorId, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al asignar repartidor: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado: data.estado,
      comentario: 'Repartidor asignado',
      usuario_id: repartidorId,
    });

    return data;
  }

  async cambiarEstado(id: string, estado: string, comentario?: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado,
      comentario: comentario || null,
    });

    return data;
  }

  async agregarObservacion(id: string, observacion: string, usuarioId: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', id)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data, error } = await supabase
      .from('solicitudes_observaciones')
      .insert({
        solicitud_id: id,
        observacion,
        usuario_id: usuarioId,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al agregar observacion: ${error.message}`, 500);
    return data;
  }

  async cancelarEmpresa(id: string, motivo: string) {
    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado: 'cancelado_empresa', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cancelar solicitud: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Solicitud no encontrada');

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: id,
      estado: 'cancelado_empresa',
      comentario: motivo || 'Solicitud cancelada por la empresa',
    });

    return data;
  }

  async historial(id: string) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', id)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data, error } = await supabase
      .from('solicitudes_tracking')
      .select('*')
      .eq('solicitud_id', id)
      .order('created_at', { ascending: true });

    if (error) throw new AppError('Error al obtener historial', 500);
    return data;
  }

  async crearOrden(data: {
    cliente_id: string;
    tecnico_id: string;
    dispositivos: Array<{
      marca: string;
      modelo: string;
      imei?: string;
      color?: string;
      servicios: Array<{
        servicio_id: string;
        cantidad: number;
        precio_unitario: number;
      }>;
    }>;
    modalidad: string;
    sucursal_id?: string;
    descripcion_problema?: string;
  }) {
    const codigoSeguimiento = generateTrackingCode();

    const { data: solicitud, error: errorSolicitud } = await supabase
      .from('solicitudes')
      .insert({
        cliente_id: data.cliente_id,
        tecnico_id: data.tecnico_id,
        descripcion_problema: data.descripcion_problema || null,
        modalidad: data.modalidad,
        sucursal_id: data.sucursal_id || null,
        estado: 'solicitud_registrada',
        codigo_seguimiento: codigoSeguimiento,
      })
      .select()
      .single();

    if (errorSolicitud) throw new AppError(`Error al crear orden: ${errorSolicitud.message}`, 500);

    for (const dispositivo of data.dispositivos) {
      const { data: dispositivoOrden, error: errorDispositivo } = await supabase
        .from('orden_dispositivos')
        .insert({
          orden_id: solicitud.id,
          marca: dispositivo.marca,
          modelo: dispositivo.modelo,
          imei: dispositivo.imei || null,
          color: dispositivo.color || null,
        })
        .select()
        .single();

      if (errorDispositivo) throw new AppError(`Error al crear dispositivo: ${errorDispositivo.message}`, 500);

      for (const servicio of dispositivo.servicios) {
        const subtotal = servicio.cantidad * servicio.precio_unitario;

        const { error: errorServicio } = await supabase
          .from('orden_servicios')
          .insert({
            orden_id: solicitud.id,
            dispositivo_orden_id: dispositivoOrden.id,
            servicio_id: servicio.servicio_id,
            cantidad: servicio.cantidad,
            precio_unitario: servicio.precio_unitario,
            subtotal: subtotal,
          });

        if (errorServicio) throw new AppError(`Error al crear servicio: ${errorServicio.message}`, 500);
      }
    }

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: solicitud.id,
      estado: 'solicitud_registrada',
      comentario: 'Orden de servicio registrada',
    });

    const { data: ordenCompleta } = await supabase
      .from('solicitudes')
      .select(`
        *,
        orden_dispositivos(*, orden_servicios(*, servicios(*))),
        clientes(*, usuarios(nombre, apellido, telefono, email)),
        usuarios:tecnico_id(nombre, apellido, email)
      `)
      .eq('id', solicitud.id)
      .single();

    return ordenCompleta;
  }

  async cambiarEstadoTecnico(ordenId: string, estado: string, comentario: string | undefined, tecnicoId: string) {
    const { data: orden } = await supabase
      .from('solicitudes')
      .select('id, tecnico_id')
      .eq('id', ordenId)
      .single();

    if (!orden) throw new NotFoundError('Orden no encontrada');
    if (orden.tecnico_id !== tecnicoId) throw new ForbiddenError('No estás asignado a esta orden');

    const { data, error } = await supabase
      .from('solicitudes')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', ordenId)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);

    await supabase.from('solicitudes_tracking').insert({
      solicitud_id: ordenId,
      estado,
      comentario: comentario || null,
      usuario_id: tecnicoId,
    });

    return data;
  }

  async getHistorialEstados(id: string) {
    const { data: orden } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', id)
      .single();

    if (!orden) throw new NotFoundError('Orden no encontrada');

    const { data: tracking, error: errorTracking } = await supabase
      .from('solicitudes_tracking')
      .select('*, usuarios(nombre, apellido)')
      .eq('solicitud_id', id)
      .order('created_at', { ascending: true });

    if (errorTracking) throw new AppError('Error al obtener historial', 500);

    const { data: dispositivos, error: errorDispositivos } = await supabase
      .from('orden_dispositivos')
      .select('*')
      .eq('orden_id', id);

    if (errorDispositivos) throw new AppError('Error al obtener dispositivos', 500);

    return {
      tracking,
      dispositivos,
    };
  }
}

export const solicitudesService = new SolicitudesService();
