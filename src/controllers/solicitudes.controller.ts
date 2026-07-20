import { Request, Response, NextFunction } from 'express';
import { solicitudesService } from '../services/solicitudes.service';
import { trackingService } from '../services/tracking.service';
import { successResponse } from '../utils/helpers';

export class SolicitudesController {
  async misSolicitudes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.misSolicitudes(req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerMiSolicitud(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.obtenerSolicitudCliente(req.params.id, req.user!.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.crear(req.user!.id, req.body);
      successResponse(res, data, 'Solicitud creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.editar(req.params.id, req.user!.id, req.body);
      successResponse(res, data, 'Solicitud actualizada');
    } catch (error) {
      next(error);
    }
  }

  async cancelar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.cancelarCliente(req.params.id, req.user!.id);
      successResponse(res, data, 'Solicitud cancelada');
    } catch (error) {
      next(error);
    }
  }

  async trackingPublico(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await trackingService.getByCodigo(req.params.codigo);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listarTodas(req: Request, res: Response, next: NextFunction) {
    try {
      const { estado, modalidad } = req.query as { estado?: string; modalidad?: string };
      const data = await solicitudesService.listarTodas({ estado, modalidad });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async confirmar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.confirmar(req.params.id);
      successResponse(res, data, 'Solicitud confirmada');
    } catch (error) {
      next(error);
    }
  }

  async asignarTecnico(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.asignarTecnico(req.params.id, req.body.usuario_id);
      successResponse(res, data, 'Tecnico asignado');
    } catch (error) {
      next(error);
    }
  }

  async asignarRepartidor(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.asignarRepartidor(req.params.id, req.body.usuario_id);
      successResponse(res, data, 'Repartidor asignado');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.cambiarEstado(req.params.id, req.body.estado, req.body.comentario);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async agregarObservacion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.agregarObservacion(
        req.params.id,
        req.body.observacion,
        req.user!.id,
      );
      successResponse(res, data, 'Observacion agregada', 201);
    } catch (error) {
      next(error);
    }
  }

  async cancelarEmpresa(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.cancelarEmpresa(req.params.id, req.body.motivo);
      successResponse(res, data, 'Solicitud cancelada');
    } catch (error) {
      next(error);
    }
  }

  async historial(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.historial(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crearOrden(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.crearOrden(req.body);
      successResponse(res, data, 'Orden de servicio creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstadoTecnico(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.cambiarEstadoTecnico(
        req.params.ordenId,
        req.body.estado,
        req.body.comentario,
        req.user!.id
      );
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async getHistorialEstados(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await solicitudesService.getHistorialEstados(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const solicitudesController = new SolicitudesController();
