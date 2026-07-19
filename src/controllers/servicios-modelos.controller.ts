import { Request, Response, NextFunction } from 'express';
import { serviciosModelosService } from '../services/servicios-modelos.service';
import { successResponse } from '../utils/helpers';

export class ServiciosModelosController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listarPorModelo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.listarPorModelo(req.params.modeloId);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.crear(req.body);
      successResponse(res, data, 'Servicio asignado al modelo exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Asignacion actualizada');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async eliminarPorModeloServicio(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await serviciosModelosService.eliminarPorModeloServicio(
        req.params.modeloId,
        req.params.servicioId,
      );
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const serviciosModelosController = new ServiciosModelosController();
