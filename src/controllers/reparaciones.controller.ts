import { Request, Response, NextFunction } from 'express';
import { reparacionesService } from '../services/reparaciones.service';
import { successResponse } from '../utils/helpers';

export class ReparacionesController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async iniciar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.iniciar(req.body.solicitudId, req.body.tecnicoId);
      successResponse(res, data, 'Reparacion iniciada', 201);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.actualizar(req.params.id, req.body);
      successResponse(res, data, 'Reparacion actualizada');
    } catch (error) {
      next(error);
    }
  }

  async finalizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.finalizar(req.params.id);
      successResponse(res, data, 'Reparacion finalizada');
    } catch (error) {
      next(error);
    }
  }

  async agregarRepuesto(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.agregarRepuesto(
        req.params.id,
        req.body.productoId,
        req.body.cantidad,
        req.body.precioUnitario,
      );
      successResponse(res, data, 'Repuesto agregado', 201);
    } catch (error) {
      next(error);
    }
  }

  async quitarRepuesto(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.quitarRepuesto(req.params.detalleId);
      successResponse(res, data, 'Repuesto quitado');
    } catch (error) {
      next(error);
    }
  }

  async agregarEvidencia(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.agregarEvidencia(
        req.params.id,
        req.body.urlArchivo,
        req.body.tipo,
        req.body.descripcion,
      );
      successResponse(res, data, 'Evidencia agregada', 201);
    } catch (error) {
      next(error);
    }
  }

  async registrarControlCalidad(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await reparacionesService.registrarControlCalidad(req.params.id, req.body);
      successResponse(res, data, 'Control de calidad registrado', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const reparacionesController = new ReparacionesController();
