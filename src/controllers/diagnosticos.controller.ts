import { Request, Response, NextFunction } from 'express';
import { diagnosticosService } from '../services/diagnosticos.service';
import { successResponse } from '../utils/helpers';

export class DiagnosticosController {
  async getBySolicitud(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await diagnosticosService.getBySolicitud(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await diagnosticosService.crear(req.params.id, req.body);
      successResponse(res, data, 'Diagnostico creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await diagnosticosService.actualizar(req.params.id, req.body);
      successResponse(res, data, 'Diagnostico actualizado');
    } catch (error) {
      next(error);
    }
  }

  async addEvidencia(req: Request, res: Response, next: NextFunction) {
    try {
      const { urlArchivo, tipo, descripcion } = req.body;
      const data = await diagnosticosService.addEvidencia(req.params.id, urlArchivo, tipo, descripcion);
      successResponse(res, data, 'Evidencia agregada', 201);
    } catch (error) {
      next(error);
    }
  }

  async deleteEvidencia(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await diagnosticosService.deleteEvidencia(req.params.evidenciaId);
      successResponse(res, data, 'Evidencia eliminada');
    } catch (error) {
      next(error);
    }
  }
}

export const diagnosticosController = new DiagnosticosController();
