import { Request, Response, NextFunction } from 'express';
import { trackingService } from '../services/tracking.service';
import { successResponse } from '../utils/helpers';

export class TrackingController {
  async getTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.getTracking(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async addEvento(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.addEvento(
        req.params.id,
        req.body.estado,
        req.body.comentario,
        req.user!.id,
        req.body.latitud,
        req.body.longitud,
      );
      successResponse(res, data, 'Evento registrado', 201);
    } catch (error) {
      next(error);
    }
  }

  async getByCodigo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.getByCodigo(req.params.codigo);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async registrarUbicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.registrarUbicacion(req.params.id, req.body.latitud, req.body.longitud);
      successResponse(res, data, 'Ubicacion registrada');
    } catch (error) {
      next(error);
    }
  }

  async getUbicacionActual(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.getUbicacionActual(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getRuta(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.getRuta(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const trackingController = new TrackingController();
