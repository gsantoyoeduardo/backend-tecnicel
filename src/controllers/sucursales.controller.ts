import { Request, Response, NextFunction } from 'express';
import { sucursalesService } from '../services/sucursales.service';
import { successResponse } from '../utils/helpers';

export class SucursalesController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.crear(req.body);
      successResponse(res, data, 'Sucursal creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.editar(req.params.id, req.body);
      successResponse(res, data, 'Sucursal actualizada');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async getHorarios(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.getHorarios(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async configurarHorarios(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await sucursalesService.configurarHorarios(req.params.id, req.body.horarios);
      successResponse(res, data, 'Horarios configurados');
    } catch (error) {
      next(error);
    }
  }
}

export const sucursalesController = new SucursalesController();
