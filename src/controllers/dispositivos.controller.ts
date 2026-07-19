import { Request, Response, NextFunction } from 'express';
import { dispositivosService } from '../services/dispositivos.service';
import { successResponse } from '../utils/helpers';

export class DispositivosController {
  async misDispositivos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.misDispositivos(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.obtenerPorId(req.params.id, req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.crear(req.user!.id, req.body);
      successResponse(res, data, 'Dispositivo registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.editar(req.params.id, req.user!.id, req.body);
      successResponse(res, data, 'Dispositivo actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.eliminar(req.params.id, req.user!.id);
      successResponse(res, data, 'Dispositivo eliminado');
    } catch (error) {
      next(error);
    }
  }

  async historial(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dispositivosService.historial(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const dispositivosController = new DispositivosController();
