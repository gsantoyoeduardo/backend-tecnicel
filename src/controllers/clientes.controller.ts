import { Request, Response, NextFunction } from 'express';
import { clientesService } from '../services/clientes.service';
import { successResponse } from '../utils/helpers';

export class ClientesController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.crear(req.body);
      successResponse(res, data, 'Cliente creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.actualizar(req.params.id, req.body);
      successResponse(res, data, 'Cliente actualizado');
    } catch (error) {
      next(error);
    }
  }

  async getSolicitudes(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.getSolicitudes(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getDispositivos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.getDispositivos(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async getDirecciones(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.getDirecciones(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async createDireccion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.createDireccion(req.params.id, req.body);
      successResponse(res, data, 'Direccion creada exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateDireccion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.updateDireccion(req.params.id, req.body);
      successResponse(res, data, 'Direccion actualizada');
    } catch (error) {
      next(error);
    }
  }

  async deleteDireccion(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await clientesService.deleteDireccion(req.params.id);
      successResponse(res, data, 'Direccion eliminada');
    } catch (error) {
      next(error);
    }
  }
}

export const clientesController = new ClientesController();
