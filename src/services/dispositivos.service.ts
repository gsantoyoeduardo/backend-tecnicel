import { supabase } from '../config/supabase';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';

export class DispositivosService {
  async misDispositivos(clienteId: string) {
    const { data, error } = await supabase
      .from('dispositivos')
      .select('*, modelos(*, marcas(*))')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar dispositivos', 500);
    return data;
  }

  async obtenerPorId(id: string, clienteId: string) {
    const { data, error } = await supabase
      .from('dispositivos')
      .select('*, modelos(*, marcas(*))')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Dispositivo no encontrado');
    if (data.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a este dispositivo');

    return data;
  }

  async crear(clienteId: string, data: { modeloId: string; imei?: string; color?: string; alias?: string }) {
    const { data: dispositivo, error } = await supabase
      .from('dispositivos')
      .insert({
        cliente_id: clienteId,
        modelo_id: data.modeloId,
        imei: data.imei || null,
        color: data.color || null,
        alias: data.alias || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear dispositivo: ${error.message}`, 500);
    return dispositivo;
  }

  async editar(id: string, clienteId: string, data: { modeloId?: string; imei?: string; color?: string; alias?: string }) {
    const { data: existing } = await supabase
      .from('dispositivos')
      .select('id, cliente_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Dispositivo no encontrado');
    if (existing.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a este dispositivo');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.modeloId !== undefined) updateData.modelo_id = data.modeloId;
    if (data.imei !== undefined) updateData.imei = data.imei;
    if (data.color !== undefined) updateData.color = data.color;
    if (data.alias !== undefined) updateData.alias = data.alias;

    const { data: dispositivo, error } = await supabase
      .from('dispositivos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar dispositivo: ${error.message}`, 500);
    return dispositivo;
  }

  async eliminar(id: string, clienteId: string) {
    const { data: existing } = await supabase
      .from('dispositivos')
      .select('id, cliente_id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Dispositivo no encontrado');
    if (existing.cliente_id !== clienteId) throw new ForbiddenError('No tienes acceso a este dispositivo');

    const { error } = await supabase
      .from('dispositivos')
      .delete()
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar dispositivo: ${error.message}`, 500);
    return { message: 'Dispositivo eliminado' };
  }

  async historial(id: string) {
    const { data: dispositivo } = await supabase
      .from('dispositivos')
      .select('id')
      .eq('id', id)
      .single();

    if (!dispositivo) throw new NotFoundError('Dispositivo no encontrado');

    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('dispositivo_id', id)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener historial', 500);
    return data;
  }
}

export const dispositivosService = new DispositivosService();
