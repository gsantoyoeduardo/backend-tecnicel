import { supabase } from '../config/supabase';
import { AppError } from '../utils/errors';

export class DashboardService {
  async resumen() {
    const [
      { count: totalSolicitudes },
      { count: totalClientes },
      { count: totalTecnicos },
      { count: solicitudesActivas },
      { data: ingresos },
    ] = await Promise.all([
      supabase.from('solicitudes').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('estado', 'activo').in('roles(nombre)', ['cliente']),
      supabase.from('usuarios').select('*', { count: 'exact', head: true }).eq('estado', 'activo').in('roles(nombre)', ['tecnico']),
      supabase.from('solicitudes').select('*', { count: 'exact', head: true }).not('estado', 'in', '("cancelado","finalizado","entregado","cancelado_cliente","cancelado_empresa")'),
      supabase.from('pagos').select('monto').eq('estado', 'confirmado'),
    ]);

    const totalIngresos = ingresos?.reduce((sum, p) => sum + Number(p.monto), 0) || 0;

    return {
      totalSolicitudes: totalSolicitudes || 0,
      totalClientes: totalClientes || 0,
      totalTecnicos: totalTecnicos || 0,
      solicitudesActivas: solicitudesActivas || 0,
      totalIngresos,
    };
  }

  async solicitudesPorEstado() {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('estado');

    if (error) throw new AppError('Error al obtener solicitudes por estado', 500);

    const agrupado: Record<string, number> = {};
    for (const s of data || []) {
      agrupado[s.estado] = (agrupado[s.estado] || 0) + 1;
    }

    return Object.entries(agrupado).map(([estado, cantidad]) => ({ estado, cantidad }));
  }

  async serviciosMasSolicitados() {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('servicio_id, servicios!inner(nombre)');

    if (error) throw new AppError('Error al obtener servicios mas solicitados', 500);

    const agrupado: Record<string, { servicioId: string; nombre: string; cantidad: number }> = {};
    for (const s of data || []) {
      const svc = (s as any).servicios;
      if (!svc) continue;
      const key = s.servicio_id || 'unknown';
      if (!agrupado[key]) {
        agrupado[key] = { servicioId: key, nombre: svc.nombre, cantidad: 0 };
      }
      agrupado[key].cantidad++;
    }

    return Object.values(agrupado)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);
  }

  async ingresos(periodo?: string) {
    let query = supabase
      .from('pagos')
      .select('monto, created_at')
      .eq('estado', 'confirmado')
      .order('created_at', { ascending: false });

    if (periodo === 'hoy') {
      const today = new Date().toISOString().split('T')[0];
      query = query.gte('created_at', today);
    } else if (periodo === 'semana') {
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', weekAgo);
    } else if (periodo === 'mes') {
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte('created_at', monthAgo);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al obtener ingresos', 500);

    const porFecha: Record<string, number> = {};
    for (const p of data || []) {
      const fecha = p.created_at ? String(p.created_at).split('T')[0] : 'sin_fecha';
      porFecha[fecha] = (porFecha[fecha] || 0) + Number(p.monto);
    }

    return Object.entries(porFecha).map(([fecha, monto]) => ({ fecha, monto }));
  }

  async rendimientoTecnicos() {
    const { data, error } = await supabase
      .from('reparaciones')
      .select('tecnico_id, estado');

    if (error) throw new AppError('Error al obtener rendimiento de tecnicos', 500);

    const agrupado: Record<string, { total: number; finalizadas: number }> = {};
    for (const r of data || []) {
      const tid = r.tecnico_id || 'sin_asignar';
      if (!agrupado[tid]) {
        agrupado[tid] = { total: 0, finalizadas: 0 };
      }
      agrupado[tid].total++;
      if (r.estado === 'finalizada') agrupado[tid].finalizadas++;
    }

    const tecnicosIds = Object.keys(agrupado).filter((id) => id !== 'sin_asignar');
    const { data: usuarios } = tecnicosIds.length
      ? await supabase.from('usuarios').select('id, nombre, apellido').in('id', tecnicosIds)
      : { data: [] };

    const usuarioMap: Record<string, string> = {};
    for (const u of usuarios || []) {
      usuarioMap[u.id] = `${u.nombre} ${u.apellido}`;
    }

    return Object.entries(agrupado).map(([tecnicoId, stats]) => ({
      tecnicoId,
      nombre: usuarioMap[tecnicoId] || 'Sin asignar',
      totalReparaciones: stats.total,
      finalizadas: stats.finalizadas,
    }));
  }

  async reporteServicios(filtros: { fechaInicio?: string; fechaFin?: string }) {
    let query = supabase
      .from('solicitudes')
      .select('*, servicios(*), clientes(*, usuarios(*))')
      .order('created_at', { ascending: false });

    if (filtros.fechaInicio) {
      query = query.gte('created_at', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query = query.lte('created_at', filtros.fechaFin);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al obtener reporte de servicios', 500);
    return data;
  }

  async reporteInventario() {
    const { data, error } = await supabase
      .from('inventario')
      .select('*, productos(*), sucursales(*)')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al obtener reporte de inventario', 500);
    return data;
  }

  async reporteClientes() {
    const { data: clientes, error: clientesError } = await supabase
      .from('clientes')
      .select('id, usuarios!inner(id, nombre, apellido, email, telefono, estado, created_at)');

    if (clientesError) throw new AppError('Error al obtener reporte de clientes', 500);

    const clientesIds = (clientes || []).map((c) => c.id);

    const [
      { data: dispositivos },
      { data: solicitudes },
    ] = await Promise.all([
      supabase.from('dispositivos').select('cliente_id').in('cliente_id', clientesIds),
      supabase.from('solicitudes').select('cliente_id').in('cliente_id', clientesIds),
    ]);

    const dispositivosPorCliente: Record<string, number> = {};
    const solicitudesPorCliente: Record<string, number> = {};

    for (const d of dispositivos || []) {
      dispositivosPorCliente[d.cliente_id] = (dispositivosPorCliente[d.cliente_id] || 0) + 1;
    }
    for (const s of solicitudes || []) {
      solicitudesPorCliente[s.cliente_id] = (solicitudesPorCliente[s.cliente_id] || 0) + 1;
    }

    return (clientes || []).map((c) => ({
      id: c.id,
      ...(c as any).usuarios,
      totalDispositivos: dispositivosPorCliente[c.id] || 0,
      totalSolicitudes: solicitudesPorCliente[c.id] || 0,
    }));
  }

  async reporteVentas(filtros: { fechaInicio?: string; fechaFin?: string }) {
    let query = supabase
      .from('pagos')
      .select('*, solicitudes(*, servicios(*))')
      .eq('estado', 'confirmado')
      .order('created_at', { ascending: false });

    if (filtros.fechaInicio) {
      query = query.gte('created_at', filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      query = query.lte('created_at', filtros.fechaFin);
    }

    const { data, error } = await query;

    if (error) throw new AppError('Error al obtener reporte de ventas', 500);
    return data;
  }
}

export const dashboardService = new DashboardService();
