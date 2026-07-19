import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class ProductosService {
  async listar(filtros?: { tipo?: string }) {
    let query = supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });

    if (filtros?.tipo) {
      query = query.eq('tipo', filtros.tipo);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al listar productos', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Producto no encontrado');
    return data;
  }

  async crear(data: {
    nombre: string;
    descripcion?: string;
    sku?: string;
    tipo?: string;
    precioCompra?: number;
    precioVenta?: number;
    stockMinimo?: number;
  }) {
    const { data: producto, error } = await supabase
      .from('productos')
      .insert({
        nombre: data.nombre,
        descripcion: data.descripcion || null,
        sku: data.sku || null,
        tipo: data.tipo || null,
        precio_compra: data.precioCompra || null,
        precio_venta: data.precioVenta || null,
        stock_minimo: data.stockMinimo || null,
        estado: 'activo',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear producto: ${error.message}`, 500);
    return producto;
  }

  async editar(id: string, data: {
    nombre?: string;
    descripcion?: string;
    sku?: string;
    tipo?: string;
    precioCompra?: number;
    precioVenta?: number;
    stockMinimo?: number;
  }) {
    const { data: existing } = await supabase
      .from('productos')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Producto no encontrado');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.descripcion !== undefined) updateData.descripcion = data.descripcion;
    if (data.sku !== undefined) updateData.sku = data.sku;
    if (data.tipo !== undefined) updateData.tipo = data.tipo;
    if (data.precioCompra !== undefined) updateData.precio_compra = data.precioCompra;
    if (data.precioVenta !== undefined) updateData.precio_venta = data.precioVenta;
    if (data.stockMinimo !== undefined) updateData.stock_minimo = data.stockMinimo;

    const { data: producto, error } = await supabase
      .from('productos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar producto: ${error.message}`, 500);
    return producto;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data: producto, error } = await supabase
      .from('productos')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    if (!producto) throw new NotFoundError('Producto no encontrado');
    return producto;
  }

  async eliminar(id: string) {
    const { error } = await supabase
      .from('productos')
      .update({ estado: 'inactivo', updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new AppError(`Error al eliminar producto: ${error.message}`, 500);
    return { success: true };
  }

  async getStock(id: string) {
    const { data: producto } = await supabase
      .from('productos')
      .select('id')
      .eq('id', id)
      .single();

    if (!producto) throw new NotFoundError('Producto no encontrado');

    const { data, error } = await supabase
      .from('inventario')
      .select('*, sucursales(nombre)')
      .eq('producto_id', id);

    if (error) throw new AppError('Error al obtener stock', 500);
    return data;
  }

  async listarRepuestosModelo(modeloId: string) {
    const { data, error } = await supabase
      .from('modelos_productos')
      .select('productos(*)')
      .eq('modelo_id', modeloId);

    if (error) throw new AppError('Error al listar repuestos del modelo', 500);
    return (data || []).map((item: any) => item.productos);
  }
}

export const productosService = new ProductosService();
