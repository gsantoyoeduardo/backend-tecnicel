import { Request, Response, NextFunction } from 'express';
import { notificacionesService } from '../services/notificaciones.service';
import { successResponse } from '../utils/helpers';

export class NotificacionesController {
  async getNotificaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await notificacionesService.getNotificaciones(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async marcarLeida(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await notificacionesService.marcarLeida(req.params.id, req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async marcarTodasLeidas(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await notificacionesService.marcarTodasLeidas(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crearNotificacion(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioId, titulo, mensaje, tipo } = req.body;
      const data = await notificacionesService.crearNotificacion(usuarioId, titulo, mensaje, tipo);
      successResponse(res, data, 'Notificacion creada', 201);
    } catch (error) {
      next(error);
    }
  }

  async registrarToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, tipo } = req.body;
      const data = await notificacionesService.registrarToken(req.user!.id, token, tipo);
      successResponse(res, data, 'Token registrado', 201);
    } catch (error) {
      next(error);
    }
  }

  async crearNotificacionPorRol(req: Request, res: Response, next: NextFunction) {
    try {
      const { rolNombre, titulo, mensaje, tipo } = req.body;
      const data = await notificacionesService.crearNotificacionPorRol(rolNombre, titulo, mensaje, tipo);
      successResponse(res, data, 'Notificaciones creadas', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const notificacionesController = new NotificacionesController();
