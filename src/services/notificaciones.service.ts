import { supabase } from '../config/supabase';
import { AppError, NotFoundError, ForbiddenError } from '../utils/errors';

export class NotificacionesService {
  async getNotificaciones(usuarioId: string) {
    const { data, error } = await supabase
      .from('notificaciones')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError('Error al listar notificaciones', 500);
    return data;
  }

  async marcarLeida(id: string, usuarioId: string) {
    const { data: notificacion } = await supabase
      .from('notificaciones')
      .select('id, usuario_id')
      .eq('id', id)
      .single();

    if (!notificacion) throw new NotFoundError('Notificacion no encontrada');
    if (notificacion.usuario_id !== usuarioId) throw new ForbiddenError('No tienes acceso a esta notificacion');

    const { data, error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new AppError(`Error al marcar notificacion: ${error.message}`, 500);
    return data;
  }

  async marcarTodasLeidas(usuarioId: string) {
    const { error } = await supabase
      .from('notificaciones')
      .update({ leida: true })
      .eq('usuario_id', usuarioId)
      .eq('leida', false);

    if (error) throw new AppError(`Error al marcar notificaciones: ${error.message}`, 500);
    return { message: 'Todas las notificaciones marcadas como leidas' };
  }

  async crearNotificacion(
    usuarioId: string,
    titulo: string,
    mensaje: string,
    tipo: string = 'general',
  ) {
    const { data, error } = await supabase
      .from('notificaciones')
      .insert({
        usuario_id: usuarioId,
        titulo,
        mensaje,
        tipo,
        leida: false,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al crear notificacion: ${error.message}`, 500);
    return data;
  }

  async registrarToken(
    usuarioId: string,
    token: string,
    tipo: string = 'push',
  ) {
    const { data, error } = await supabase
      .from('tokens_dispositivo')
      .insert({
        usuario_id: usuarioId,
        token,
        tipo,
      })
      .select()
      .single();

    if (error) throw new AppError(`Error al registrar token: ${error.message}`, 500);
    return data;
  }

  async crearNotificacionPorRol(
    rolNombre: string,
    titulo: string,
    mensaje: string,
    tipo: string = 'general',
  ) {
    const { data: rol } = await supabase
      .from('roles')
      .select('id')
      .eq('nombre', rolNombre)
      .single();

    if (!rol) throw new NotFoundError('Rol no encontrado');

    const { data: usuarios, error: usuariosError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('rol_id', rol.id)
      .eq('estado', 'activo');

    if (usuariosError) throw new AppError('Error al obtener usuarios del rol', 500);
    if (!usuarios || usuarios.length === 0) return [];

    const notificaciones = usuarios.map((u) => ({
      usuario_id: u.id,
      titulo,
      mensaje,
      tipo,
      leida: false,
    }));

    const { data, error } = await supabase
      .from('notificaciones')
      .insert(notificaciones)
      .select();

    if (error) throw new AppError(`Error al crear notificaciones: ${error.message}`, 500);
    return data;
  }
}

export const notificacionesService = new NotificacionesService();
