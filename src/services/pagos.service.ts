import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class PagosService {
  async listar() {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, solicitudes(*)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar pagos', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, solicitudes(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Pago no encontrado');
    return data;
  }

  async crear(
    solicitudId: string,
    data: {
      monto: number;
      metodoPago: string;
      descripcion?: string;
    },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id, cliente_id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const { data: pago, error } = await supabase
      .from('pagos')
      .insert({
        solicitud_id: solicitudId,
        cliente_id: solicitud.cliente_id,
        monto: data.monto,
        metodo_pago: data.metodoPago,
        descripcion: data.descripcion || null,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear pago: ${error.message}`, 500);
    return pago;
  }

  async confirmar(id: string) {
    const { data, error } = await supabase
      .from('pagos')
      .update({ estado: 'confirmado', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al confirmar pago: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Pago no encontrado');
    return data;
  }

  async anular(id: string) {
    const { data, error } = await supabase
      .from('pagos')
      .update({ estado: 'anulado', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al anular pago: ${error.message}`, 500);
    if (!data) throw new NotFoundError('Pago no encontrado');
    return data;
  }

  async getComprobante(id: string) {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, solicitudes(*, servicios(*))')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Pago no encontrado');
    return data;
  }

  async misPagos(clienteId: string) {
    const { data, error } = await supabase
      .from('pagos')
      .select('*, solicitudes(*, servicios(*))')
      .eq('cliente_id', clienteId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar pagos', 500);
    return data;
  }
}

export const pagosService = new PagosService();
