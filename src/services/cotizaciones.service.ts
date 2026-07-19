import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class CotizacionesService {
  async listar() {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, solicitudes(*), cotizaciones_items(*)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar cotizaciones', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, solicitudes(*), cotizaciones_items(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Cotizacion no encontrada');
    return data;
  }

  async getBySolicitud(solicitudId: string) {
    const { data, error } = await supabase
      .from('cotizaciones')
      .select('*, cotizaciones_items(*)')
      .eq('solicitud_id', solicitudId)
      .order('created_at', { ascending: false })
      .single();

    if (error) throw new AppError('Error al obtener cotizacion', 500);
    return data;
  }

  async crear(
    solicitudId: string,
    data: {
      manoDeObra?: number;
      descuento?: number;
      impuesto?: number;
      observaciones?: string;
      items: Array<{
        productoId?: string;
        cantidad: number;
        precioUnitario: number;
      }>;
    },
  ) {
    const { data: solicitud } = await supabase
      .from('solicitudes')
      .select('id')
      .eq('id', solicitudId)
      .single();

    if (!solicitud) throw new NotFoundError('Solicitud no encontrada');

    const itemsSubtotal = data.items.reduce(
      (sum, item) => sum + item.cantidad * item.precioUnitario,
      0,
    );
    const manoDeObra = data.manoDeObra || 0;
    const descuento = data.descuento || 0;
    const impuesto = data.impuesto || 0;
    const total = itemsSubtotal + manoDeObra - descuento + impuesto;

    const { data: cotizacion, error } = await supabase
      .from('cotizaciones')
      .insert({
        solicitud_id: solicitudId,
        mano_de_obra: manoDeObra,
        descuento,
        impuesto,
        subtotal: itemsSubtotal,
        total,
        observaciones: data.observaciones || null,
        estado: 'pendiente',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear cotizacion: ${error.message}`, 500);

    const itemsToInsert = data.items.map((item) => ({
      cotizacion_id: cotizacion.id,
      producto_id: item.productoId || null,
      cantidad: item.cantidad,
      precio_unitario: item.precioUnitario,
    }));

    const { error: itemsError } = await supabase
      .from('cotizaciones_items')
      .insert(itemsToInsert);

    if (itemsError) throw new AppError(`Error al crear items de cotizacion: ${itemsError.message}`, 500);

    const { data: result } = await supabase
      .from('cotizaciones')
      .select('*, cotizaciones_items(*)')
      .eq('id', cotizacion.id)
      .single();

    return result;
  }

  async editar(
    id: string,
    data: {
      manoDeObra?: number;
      descuento?: number;
      impuesto?: number;
      observaciones?: string;
      items?: Array<{
        productoId?: string;
        cantidad: number;
        precioUnitario: number;
      }>;
    },
  ) {
    const { data: existing } = await supabase
      .from('cotizaciones')
      .select('*, cotizaciones_items(*)')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Cotizacion no encontrada');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.manoDeObra !== undefined) updateData.mano_de_obra = data.manoDeObra;
    if (data.descuento !== undefined) updateData.descuento = data.descuento;
    if (data.impuesto !== undefined) updateData.impuesto = data.impuesto;
    if (data.observaciones !== undefined) updateData.observaciones = data.observaciones;

    let itemsSubtotal = 0;
    const currentItems = existing.cotizaciones_items || [];
    if (data.items && data.items.length > 0) {
      itemsSubtotal = data.items.reduce(
        (sum, item) => sum + item.cantidad * item.precioUnitario,
        0,
      );

      await supabase
        .from('cotizaciones_items')
        .delete()
        .eq('cotizacion_id', id);

      const itemsToInsert = data.items.map((item) => ({
        cotizacion_id: id,
        producto_id: item.productoId || null,
        cantidad: item.cantidad,
        precio_unitario: item.precioUnitario,
      }));

      const { error: itemsError } = await supabase
        .from('cotizaciones_items')
        .insert(itemsToInsert);

      if (itemsError) throw new AppError(`Error al actualizar items: ${itemsError.message}`, 500);
    } else {
      itemsSubtotal = currentItems.reduce(
        (sum: number, item: { cantidad: number; precio_unitario: number }) =>
          sum + item.cantidad * item.precio_unitario,
        0,
      );
    }

    const manoDeObra = updateData.mano_de_obra !== undefined
      ? (updateData.mano_de_obra as number)
      : existing.mano_de_obra;
    const descuento = updateData.descuento !== undefined
      ? (updateData.descuento as number)
      : existing.descuento;
    const impuesto = updateData.impuesto !== undefined
      ? (updateData.impuesto as number)
      : existing.impuesto;

    updateData.subtotal = itemsSubtotal;
    updateData.total = itemsSubtotal + manoDeObra - descuento + impuesto;

    const { data: cotizacion, error } = await supabase
      .from('cotizaciones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al actualizar cotizacion: ${error.message}`, 500);

    const { data: result } = await supabase
      .from('cotizaciones')
      .select('*, cotizaciones_items(*)')
      .eq('id', id)
      .single();

    return result;
  }

  async enviar(id: string) {
    const { data: existing } = await supabase
      .from('cotizaciones')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Cotizacion no encontrada');

    const { data, error } = await supabase
      .from('cotizaciones')
      .update({ estado: 'enviada', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al enviar cotizacion: ${error.message}`, 500);
    return data;
  }

  async aprobar(id: string) {
    const { data: existing } = await supabase
      .from('cotizaciones')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Cotizacion no encontrada');

    const { data, error } = await supabase
      .from('cotizaciones')
      .update({ estado: 'aprobada', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al aprobar cotizacion: ${error.message}`, 500);
    return data;
  }

  async rechazar(id: string) {
    const { data: existing } = await supabase
      .from('cotizaciones')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Cotizacion no encontrada');

    const { data, error } = await supabase
      .from('cotizaciones')
      .update({ estado: 'rechazada', updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al rechazar cotizacion: ${error.message}`, 500);
    return data;
  }
}

export const cotizacionesService = new CotizacionesService();
