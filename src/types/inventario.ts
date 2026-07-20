import { Producto } from './productos';

export interface InventarioItem {
  id: string;
  producto_id: string;
  sucursal_id: string;
  cantidad: number;
  created_at: string;
  updated_at: string;
  productos?: Producto;
  sucursales?: { nombre: string };
}

export interface MovimientoInventario {
  id: string;
  producto_id: string;
  sucursal_id: string;
  tipo: string;
  cantidad: number;
  motivo: string | null;
  referencia_id: string | null;
  usuario_id: string | null;
  created_at: string;
  productos?: { nombre: string };
  sucursales?: { nombre: string };
}

export interface RegistrarEntradaData {
  productoId: string;
  sucursalId: string;
  cantidad: number;
  motivo?: string;
  usuarioId?: string;
}

export interface RegistrarSalidaData {
  productoId: string;
  sucursalId: string;
  cantidad: number;
  motivo?: string;
  usuarioId?: string;
}

export interface RegistrarAjusteData {
  productoId: string;
  sucursalId: string;
  cantidad: number;
  motivo?: string;
  usuarioId?: string;
}

export interface TransferirData {
  productoId: string;
  sucursalOrigenId: string;
  sucursalDestinoId: string;
  cantidad: number;
  usuarioId?: string;
}

export interface StockBajoItem {
  id: string;
  producto_id: string;
  sucursal_id: string;
  cantidad: number;
  created_at: string;
  updated_at: string;
  productos?: Producto & { stock_minimo: number };
  sucursales?: { nombre: string };
}
