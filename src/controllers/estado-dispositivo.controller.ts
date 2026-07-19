import { Request, Response, NextFunction } from 'express';
import { estadoDispositivoService } from '../services/estado-dispositivo.service';
import { successResponse } from '../utils/helpers';

export class EstadoDispositivoController {
  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await estadoDispositivoService.crear(req.params.id, {
        ...req.body,
        tecnico_id: req.user!.id,
      });
      successResponse(res, data, 'Estado registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorSolicitud(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await estadoDispositivoService.obtenerPorSolicitud(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorTipo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await estadoDispositivoService.obtenerPorTipo(
        req.params.id,
        req.params.tipo as 'ingreso' | 'salida'
      );
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await estadoDispositivoService.actualizar(
        req.params.id,
        req.params.tipo as 'ingreso' | 'salida',
        req.body
      );
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }
}

export const estadoDispositivoController = new EstadoDispositivoController();
