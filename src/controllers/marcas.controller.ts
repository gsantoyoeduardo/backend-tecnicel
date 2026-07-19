import { Request, Response, NextFunction } from 'express';
import { marcasService } from '../services/marcas.service';
import { successResponse } from '../utils/helpers';

export class MarcasController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.crear(req.body);
      successResponse(res, data, 'Marca creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.editar(req.params.id, req.body);
      successResponse(res, data, 'Marca actualizada');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await marcasService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const marcasController = new MarcasController();
