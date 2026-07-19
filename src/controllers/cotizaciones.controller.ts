import { Request, Response, NextFunction } from 'express';
import { cotizacionesService } from '../services/cotizaciones.service';
import { successResponse } from '../utils/helpers';

export class CotizacionesController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getBySolicitud(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.getBySolicitud(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.crear(req.params.id, req.body);
      successResponse(res, data, 'Cotizacion creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.editar(req.params.id, req.body);
      successResponse(res, data, 'Cotizacion actualizada');
    } catch (error) {
      next(error);
    }
  }

  async enviar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.enviar(req.params.id);
      successResponse(res, data, 'Cotizacion enviada');
    } catch (error) {
      next(error);
    }
  }

  async aprobar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.aprobar(req.params.id);
      successResponse(res, data, 'Cotizacion aprobada');
    } catch (error) {
      next(error);
    }
  }

  async rechazar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.rechazar(req.params.id);
      successResponse(res, data, 'Cotizacion rechazada');
    } catch (error) {
      next(error);
    }
  }

  async pdf(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await cotizacionesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const cotizacionesController = new CotizacionesController();
