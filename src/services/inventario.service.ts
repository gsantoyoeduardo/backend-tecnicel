import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class InventarioService {
  private async createOrUpdateInventory(
    productoId: string,
    sucursalId: string,
    cantidad: number,
    mode: 'add' | 'subtract' | 'set',
  ) {
    const { data: existing } = await supabase
      .from('inventario')
      .select('id, cantidad')
      .eq('producto_id', productoId)
      .eq('sucursal_id', sucursalId)
      .maybeSingle();

    if (existing) {
      let newCantidad: number;
      if (mode === 'add') {
        newCantidad = existing.cantidad + cantidad;
      } else if (mode === 'subtract') {
        newCantidad = existing.cantidad - cantidad;
      } else {
        newCantidad = cantidad;
      }

      if (newCantidad < 0) {
        throw new AppError('Stock insuficiente para realizar la operacion', 400);
      }

      const { data, error } = await supabase
        .from('inventario')
        .update({ cantidad: newCantidad, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new AppError(`Error al actualizar inventario: ${error.message}`, 500);
      return data;
    }

    if (mode === 'subtract') {
      throw new AppError('No hay stock registrado en esta sucursal', 400);
    }

    if (cantidad < 0) {
      throw new AppError('La cantidad inicial no puede ser negativa', 400);
    }

    const { data, error } = await supabase
      .from('inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalId,
        cantidad,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear inventario: ${error.message}`, 500);
    return data;
  }

  async consultar() {
    const { data, error } = await supabase
      .from('inventario')
      .select('*, productos(*), sucursales(nombre)')
      .order('updated_at', { ascending: false });

    if (error) throw new AppError('Error al consultar inventario', 500);
    return data;
  }

  async movimientos(filtros?: { productoId?: string; sucursalId?: string; tipo?: string }) {
    let query = supabase
      .from('movimientos_inventario')
      .select('*, productos(nombre), sucursales(nombre)')
      .order('created_at', { ascending: false });

    if (filtros?.productoId) {
      query = query.eq('producto_id', filtros.productoId);
    }
    if (filtros?.sucursalId) {
      query = query.eq('sucursal_id', filtros.sucursalId);
    }
    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al listar movimientos', 500);
    return data;
  }

  async registrarEntrada(productoId: string, sucursalId: string, cantidad: number, motivo?: string, usuarioId?: string) {
    await this.createOrUpdateInventory(productoId, sucursalId, cantidad, 'add');

    const { data, error } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalId,
        tipo: 'entrada',
        cantidad,
        motivo: motivo || null,
        usuario_id: usuarioId || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar movimiento: ${error.message}`, 500);
    return data;
  }

  async registrarSalida(productoId: string, sucursalId: string, cantidad: number, motivo?: string, usuarioId?: string) {
    await this.createOrUpdateInventory(productoId, sucursalId, cantidad, 'subtract');

    const { data, error } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalId,
        tipo: 'salida',
        cantidad,
        motivo: motivo || null,
        usuario_id: usuarioId || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar movimiento: ${error.message}`, 500);
    return data;
  }

  async registrarAjuste(productoId: string, sucursalId: string, cantidad: number, motivo?: string, usuarioId?: string) {
    await this.createOrUpdateInventory(productoId, sucursalId, cantidad, 'set');

    const { data, error } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalId,
        tipo: 'ajuste',
        cantidad,
        motivo: motivo || null,
        usuario_id: usuarioId || null,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar movimiento: ${error.message}`, 500);
    return data;
  }

  async transferir(
    productoId: string,
    sucursalOrigenId: string,
    sucursalDestinoId: string,
    cantidad: number,
    usuarioId?: string,
  ) {
    await this.createOrUpdateInventory(productoId, sucursalOrigenId, cantidad, 'subtract');
    await this.createOrUpdateInventory(productoId, sucursalDestinoId, cantidad, 'add');

    const { data: movimientoSalida, error: errorSalida } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalOrigenId,
        tipo: 'transferencia_salida',
        cantidad,
        motivo: `Transferencia a sucursal ${sucursalDestinoId}`,
        usuario_id: usuarioId || null,
      })
      .select()
      .single();

    if (errorSalida) throw new AppError(`Error al registrar movimiento de salida: ${errorSalida.message}`, 500);

    const { data: movimientoEntrada, error: errorEntrada } = await supabase
      .from('movimientos_inventario')
      .insert({
        producto_id: productoId,
        sucursal_id: sucursalDestinoId,
        tipo: 'transferencia_entrada',
        cantidad,
        motivo: `Transferencia desde sucursal ${sucursalOrigenId}`,
        usuario_id: usuarioId || null,
      })
      .select()
      .single();

    if (errorEntrada) throw new AppError(`Error al registrar movimiento de entrada: ${errorEntrada.message}`, 500);

    return { salida: movimientoSalida, entrada: movimientoEntrada };
  }

  async stockBajo() {
    const { data, error } = await supabase
      .from('inventario')
      .select('*, productos(*)')
      .not('productos', 'is', null);

    if (error) throw new AppError('Error al consultar stock bajo', 500);

    return (data || []).filter((item: any) => {
      const stockMinimo = item.productos?.stock_minimo;
      if (stockMinimo == null) return false;
      return item.cantidad < stockMinimo;
    });
  }
}

export const inventarioService = new InventarioService();
