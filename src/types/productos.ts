export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  sku: string | null;
  tipo: 'repuesto' | 'accesorio' | 'insumo' | null;
  precio_compra: number | null;
  precio_venta: number | null;
  stock_minimo: number | null;
  estado: string;
  created_at: string;
  updated_at: string | null;
}

export interface CrearProductoData {
  nombre: string;
  descripcion?: string;
  sku?: string;
  tipo?: string;
  precioCompra?: number;
  precioVenta?: number;
  stockMinimo?: number;
}

export interface EditarProductoData {
  nombre?: string;
  descripcion?: string;
  sku?: string;
  tipo?: string;
  precioCompra?: number;
  precioVenta?: number;
  stockMinimo?: number;
}

export interface StockProducto {
  id: string;
  producto_id: string;
  sucursal_id: string;
  cantidad: number;
  created_at: string;
  updated_at: string;
  sucursales?: { nombre: string };
}
