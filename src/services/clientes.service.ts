import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ClientesService {
  async listar() {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, usuarios!inner(id, email, nombre, apellido, telefono, estado)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar clientes', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*, usuarios!inner(id, email, nombre, apellido, telefono, estado)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Cliente no encontrado');
    return data;
  }

  async crear(data: {
    tipo_documento?: string;
    numero_documento?: string;
    usuario_id: string;
    fecha_nacimiento?: string;
  }) {
    const { data: existing } = await supabase
      .from('clientes')
      .select('id')
      .eq('usuario_id', data.usuario_id)
      .maybeSingle();

    if (existing) throw new AppError('El usuario ya tiene un perfil de cliente', 409);

    const { data: cliente, error } = await supabase
      .from('clientes')
      .insert({
        tipo_documento: data.tipo_documento || null,
        numero_documento: data.numero_documento || null,
        usuario_id: data.usuario_id,
        fecha_nacimiento: data.fecha_nacimiento || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear cliente: ${error.message}`, 500);
    return cliente;
  }

  async actualizar(id: string, data: {
    tipo_documento?: string;
    numero_documento?: string;
    fecha_nacimiento?: string;
  }) {
    const { data: cliente, error } = await supabase
      .from('clientes')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar: ${error.message}`, 500);
    if (!cliente) throw new NotFoundError('Cliente no encontrado');

    return cliente;
  }

  async getSolicitudes(id: string) {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', id)
      .single();

    if (!cliente) throw new NotFoundError('Cliente no encontrado');

    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener solicitudes', 500);
    return data;
  }

  async getDispositivos(id: string) {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', id)
      .single();

    if (!cliente) throw new NotFoundError('Cliente no encontrado');

    const { data, error } = await supabase
      .from('dispositivos')
      .select('*')
      .eq('cliente_id', id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener dispositivos', 500);
    return data;
  }

  async getDirecciones(id: string) {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', id)
      .single();

    if (!cliente) throw new NotFoundError('Cliente no encontrado');

    const { data, error } = await supabase
      .from('direcciones')
      .select('*')
      .eq('cliente_id', id)
      .order('es_principal', { ascending: false, nullsFirst: false });

    if (error) throw new AppError('Error al obtener direcciones', 500);
    return data;
  }

  async createDireccion(clienteId: string, data: {
    direccion: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    referencia?: string;
    latitud?: string;
    longitud?: string;
    es_principal?: boolean;
  }) {
    const { data: cliente } = await supabase
      .from('clientes')
      .select('id')
      .eq('id', clienteId)
      .single();

    if (!cliente) throw new NotFoundError('Cliente no encontrado');

    if (data.es_principal) {
      await supabase
        .from('direcciones')
        .update({ es_principal: false })
        .eq('cliente_id', clienteId);
    }

    const { data: direccion, error } = await supabase
      .from('direcciones')
      .insert({
        cliente_id: clienteId,
        direccion: data.direccion,
        distrito: data.distrito || null,
        provincia: data.provincia || null,
        departamento: data.departamento || null,
        referencia: data.referencia || null,
        latitud: data.latitud || null,
        longitud: data.longitud || null,
        es_principal: data.es_principal || false,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear direccion: ${error.message}`, 500);
    return direccion;
  }

  async updateDireccion(id: string, data: {
    direccion?: string;
    distrito?: string;
    provincia?: string;
    departamento?: string;
    referencia?: string;
    latitud?: string;
    longitud?: string;
    es_principal?: boolean;
  }) {
    const { data: existing } = await supabase
      .from('direcciones')
      .select('id, cliente_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Direccion no encontrada');

    if (data.es_principal) {
      await supabase
        .from('direcciones')
        .update({ es_principal: false })
        .eq('cliente_id', existing.cliente_id)
        .neq('id', id);
    }

    const { data: direccion, error } = await supabase
      .from('direcciones')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar direccion: ${error.message}`, 500);
    return direccion;
  }

  async deleteDireccion(id: string) {
    const { data: existing } = await supabase
      .from('direcciones')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Direccion no encontrada');

    const { error } = await supabase
      .from('direcciones')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar direccion: ${error.message}`, 500);
    return { message: 'Direccion eliminada' };
  }
}

export const clientesService = new ClientesService();
