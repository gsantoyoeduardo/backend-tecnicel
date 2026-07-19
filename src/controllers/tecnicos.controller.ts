import { Request, Response, NextFunction } from 'express';
import { tecnicosService } from '../services/tecnicos.service';
import { successResponse } from '../utils/helpers';

export class TecnicosController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.crear(req.body);
      successResponse(res, data, 'Tecnico creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Tecnico actualizado');
    } catch (error) {
      next(error);
    }
  }

  async getServicios(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.getServicios(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async asignarServicios(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.asignarServicios(req.params.id, req.body.servicioIds);
      successResponse(res, data, 'Servicios asignados exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async getDisponibilidad(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.getDisponibilidad(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getAsignaciones(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.getAsignaciones(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async misServicios(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.misServicios(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async iniciarAtencion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.iniciarAtencion(req.params.solicitudId, req.user!.id);
      successResponse(res, data, 'Atencion iniciada');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.cambiarEstado(
        req.params.solicitudId,
        req.user!.id,
        req.body.estado,
        req.body.comentario,
      );
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async registrarDiagnostico(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.registrarDiagnostico(
        req.params.solicitudId,
        req.user!.id,
        req.body,
      );
      successResponse(res, data, 'Diagnostico registrado', 201);
    } catch (error) {
      next(error);
    }
  }

  async subirEvidencias(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.subirEvidencias(
        req.params.solicitudId,
        req.user!.id,
        req.body.urlArchivo,
        req.body.tipo,
      );
      successResponse(res, data, 'Evidencia subida', 201);
    } catch (error) {
      next(error);
    }
  }

  async finalizarAtencion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await tecnicosService.finalizarAtencion(req.params.solicitudId, req.user!.id);
      successResponse(res, data, 'Atencion finalizada');
    } catch (error) {
      next(error);
    }
  }
}

export const tecnicosController = new TecnicosController();
