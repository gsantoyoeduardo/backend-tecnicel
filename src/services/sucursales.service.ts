import { supabase } from '../config/supabase';
import { AppError, NotFoundError } from '../utils/errors';

export class SucursalesService {
  async listar() {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar sucursales', 500);
    return data;
  }

  async obtenerPorId(id: string) {
    const { data, error } = await supabase
      .from('sucursales')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) throw new NotFoundError('Sucursal no encontrada');
    return data;
  }

  async crear(data: {
    nombre: string;
    direccion: string;
    telefono?: string;
    email?: string;
    latitud?: string;
    longitud?: string;
  }) {
    const { data: sucursal, error } = await supabase
      .from('sucursales')
      .insert({
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono || null,
        email: data.email || null,
        latitud: data.latitud || null,
        longitud: data.longitud || null,
        estado: 'activo',
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear sucursal: ${error.message}`, 500);
    return sucursal;
  }

  async editar(id: string, data: {
    nombre?: string;
    direccion?: string;
    telefono?: string;
    email?: string;
    latitud?: string;
    longitud?: string;
  }) {
    const { data: existing } = await supabase
      .from('sucursales')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Sucursal no encontrada');

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (data.nombre !== undefined) updateData.nombre = data.nombre;
    if (data.direccion !== undefined) updateData.direccion = data.direccion;
    if (data.telefono !== undefined) updateData.telefono = data.telefono;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.latitud !== undefined) updateData.latitud = data.latitud;
    if (data.longitud !== undefined) updateData.longitud = data.longitud;

    const { data: sucursal, error } = await supabase
      .from('sucursales')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al editar sucursal: ${error.message}`, 500);
    return sucursal;
  }

  async cambiarEstado(id: string, estado: string) {
    const { data: existing } = await supabase
      .from('sucursales')
      .select('id')
      .eq('id', id)
      .single();

    if (!existing) throw new NotFoundError('Sucursal no encontrada');

    const { data, error } = await supabase
      .from('sucursales')
      .update({ estado, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al cambiar estado: ${error.message}`, 500);
    return data;
  }

  async getHorarios(sucursalId: string) {
    const { data: sucursal } = await supabase
      .from('sucursales')
      .select('id')
      .eq('id', sucursalId)
      .single();

    if (!sucursal) throw new NotFoundError('Sucursal no encontrada');

    const { data, error } = await supabase
      .from('sucursales_horarios')
      .select('*')
      .eq('sucursal_id', sucursalId)
      .order('dia_semana', { ascending: true });

    if (error) throw new AppError('Error al obtener horarios', 500);
    return data;
  }

  async configurarHorarios(
    sucursalId: string,
    horarios: Array<{ diaSemana: number; horaApertura: string; horaCierre: string }>,
  ) {
    const { data: sucursal } = await supabase
      .from('sucursales')
      .select('id')
      .eq('id', sucursalId)
      .single();

    if (!sucursal) throw new NotFoundError('Sucursal no encontrada');

    await supabase.from('sucursales_horarios').delete().eq('sucursal_id', sucursalId);

    if (horarios.length > 0) {
      const rows = horarios.map((h) => ({
        sucursal_id: sucursalId,
        dia_semana: h.diaSemana,
        hora_apertura: h.horaApertura,
        hora_cierre: h.horaCierre,
      }));

      const { error } = await supabase.from('sucursales_horarios').insert(rows);

      if (error) throw new AppError(`Error al configurar horarios: ${error.message}`, 500);
    }

    const { data, error } = await supabase
      .from('sucursales_horarios')
      .select('*')
      .eq('sucursal_id', sucursalId)
      .order('dia_semana', { ascending: true });

    if (error) throw new AppError('Error al obtener horarios', 500);
    return data;
  }
}

export const sucursalesService = new SucursalesService();
