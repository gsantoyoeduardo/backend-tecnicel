export interface ReporteServicioItem {
  id: string;
  servicio_id: string;
  cliente_id: string;
  estado: string;
  created_at: string;
  servicios?: {
    id: string;
    nombre: string;
    descripcion: string | null;
    precio_base: number;
  };
  clientes?: {
    id: string;
    usuarios?: {
      id: string;
      nombre: string;
      apellido: string;
      email: string;
    };
  };
}

export interface ReporteInventarioItem {
  id: string;
  producto_id: string;
  sucursal_id: string;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string | null;
  created_at: string;
  productos?: {
    id: string;
    nombre: string;
    sku: string | null;
    tipo: string;
    precio_venta: number;
  };
  sucursales?: {
    id: string;
    nombre: string;
    direccion: string;
  };
}

export interface ReporteClienteItem {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  estado: string;
  created_at: string;
  totalDispositivos: number;
  totalSolicitudes: number;
}

export interface ReporteVentaItem {
  id: string;
  monto: number;
  metodo_pago: string;
  estado: string;
  created_at: string;
  solicitudes?: {
    id: string;
    codigo_seguimiento: string;
    servicios?: {
      id: string;
      nombre: string;
    };
  };
}

export interface ReporteServicioResumen {
  nombre: string;
  cantidad: number;
}

export interface ReporteInventarioResumen {
  producto: string;
  stock: number;
  stockMinimo: number;
}

export interface ReporteClienteResumen {
  nombre: string;
  solicitudes: number;
}

export interface ReporteVentaResumen {
  fecha: string;
  monto: number;
}
