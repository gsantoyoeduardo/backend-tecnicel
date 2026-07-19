import { Request, Response, NextFunction } from 'express';
import { serviciosService } from '../services/servicios.service';
import { successResponse } from '../utils/helpers';

export class ServiciosController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.crear(req.body);
      successResponse(res, data, 'Servicio creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Servicio actualizado');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const serviciosController = new ServiciosController();
