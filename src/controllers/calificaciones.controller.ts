import { Request, Response, NextFunction } from 'express';
import { calificacionesService } from '../services/calificaciones.service';
import { successResponse } from '../utils/helpers';

export class CalificacionesController {
  async calificar(req: Request, res: Response, next: NextFunction) {
    try {
      const { calificacion, comentario } = req.body;
      const data = await calificacionesService.calificar(
        req.params.id,
        req.user!.id,
        calificacion,
        comentario,
      );
      successResponse(res, data, 'Calificacion registrada', 201);
    } catch (error) {
      next(error);
    }
  }

  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await calificacionesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crearReclamo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await calificacionesService.crearReclamo(
        req.params.id,
        req.user!.id,
        req.body,
      );
      successResponse(res, data, 'Reclamo creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async listarReclamos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await calificacionesService.listarReclamos();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getReclamo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await calificacionesService.getReclamo(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async actualizarEstadoReclamo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await calificacionesService.actualizarEstadoReclamo(req.params.id, req.body);
      successResponse(res, data, 'Estado de reclamo actualizado');
    } catch (error) {
      next(error);
    }
  }
}

export const calificacionesController = new CalificacionesController();
