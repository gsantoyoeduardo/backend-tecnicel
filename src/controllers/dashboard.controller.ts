import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { successResponse } from '../utils/helpers';

export class DashboardController {
  async resumen(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.resumen();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async solicitudesPorEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.solicitudesPorEstado();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async serviciosMasSolicitados(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.serviciosMasSolicitados();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async ingresos(req: Request, res: Response, next: NextFunction) {
    try {
      const { periodo } = req.query as { periodo?: string };
      const data = await dashboardService.ingresos(periodo);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async rendimientoTecnicos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.rendimientoTecnicos();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async reporteServicios(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaFin } = req.query as { fechaInicio?: string; fechaFin?: string };
      const data = await dashboardService.reporteServicios({ fechaInicio, fechaFin });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async reporteInventario(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.reporteInventario();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async reporteClientes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.reporteClientes();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async reporteVentas(req: Request, res: Response, next: NextFunction) {
    try {
      const { fechaInicio, fechaFin } = req.query as { fechaInicio?: string; fechaFin?: string };
      const data = await dashboardService.reporteVentas({ fechaInicio, fechaFin });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
