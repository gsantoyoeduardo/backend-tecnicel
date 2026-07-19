import { Request, Response, NextFunction } from 'express';
import { modelosService } from '../services/modelos.service';
import { successResponse } from '../utils/helpers';

export class ModelosController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { marcaId, buscar, estado } = req.query as {
        marcaId?: string;
        buscar?: string;
        estado?: string;
      };

      const data = await modelosService.listar({ marcaId, buscar, estado });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listarPorMarca(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.listarPorMarca(req.params.marcaId);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.crear(req.body);
      successResponse(res, data, 'Modelo creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Modelo actualizado');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await modelosService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const modelosController = new ModelosController();
