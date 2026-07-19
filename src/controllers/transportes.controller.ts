import { Request, Response, NextFunction } from 'express';
import { transportesService } from '../services/transportes.service';
import { successResponse } from '../utils/helpers';

export class TransportesController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async programarRecojo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.programarRecojo(req.params.id, req.body);
      successResponse(res, data, 'Recojo programado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async programarEntrega(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.programarEntrega(req.params.id, req.body);
      successResponse(res, data, 'Entrega programada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.editar(req.params.id, req.body);
      successResponse(res, data, 'Transporte actualizado');
    } catch (error) {
      next(error);
    }
  }

  async iniciar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.iniciar(req.params.id);
      successResponse(res, data, 'Transporte iniciado');
    } catch (error) {
      next(error);
    }
  }

  async confirmarRecojo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.confirmarRecojo(req.params.id);
      successResponse(res, data, 'Recojo confirmado');
    } catch (error) {
      next(error);
    }
  }

  async confirmarEntrega(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.confirmarEntrega(req.params.id);
      successResponse(res, data, 'Entrega confirmada');
    } catch (error) {
      next(error);
    }
  }

  async enviarUbicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.enviarUbicacion(
        req.params.id,
        req.body.latitud,
        req.body.longitud,
      );
      successResponse(res, data, 'Ubicacion actualizada');
    } catch (error) {
      next(error);
    }
  }

  async getUbicacion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await transportesService.getUbicacion(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const transportesController = new TransportesController();
