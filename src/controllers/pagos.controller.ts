import { Request, Response, NextFunction } from 'express';
import { pagosService } from '../services/pagos.service';
import { successResponse } from '../utils/helpers';

export class PagosController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.crear(req.params.id, req.body);
      successResponse(res, data, 'Pago creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async confirmar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.confirmar(req.params.id);
      successResponse(res, data, 'Pago confirmado');
    } catch (error) {
      next(error);
    }
  }

  async anular(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.anular(req.params.id);
      successResponse(res, data, 'Pago anulado');
    } catch (error) {
      next(error);
    }
  }

  async getComprobante(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.getComprobante(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async misPagos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await pagosService.misPagos(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const pagosController = new PagosController();
