import { Request, Response, NextFunction } from 'express';
import { categoriasServicioService } from '../services/categorias-servicio.service';
import { successResponse } from '../utils/helpers';

export class CategoriasServicioController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoriasServicioService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoriasServicioService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoriasServicioService.crear(req.body);
      successResponse(res, data, 'Categoria creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoriasServicioService.editar(req.params.id, req.body);
      successResponse(res, data, 'Categoria actualizada');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await categoriasServicioService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const categoriasServicioController = new CategoriasServicioController();
