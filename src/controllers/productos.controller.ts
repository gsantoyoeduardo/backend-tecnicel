import { Request, Response, NextFunction } from 'express';
import { productosService } from '../services/productos.service';
import { successResponse } from '../utils/helpers';

export class ProductosController {
  async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { tipo } = req.query as { tipo?: string };
      const data = await productosService.listar({ tipo });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.crear(req.body);
      successResponse(res, data, 'Producto creado', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Producto actualizado');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.eliminar(req.params.id);
      successResponse(res, data, 'Producto eliminado');
    } catch (error) {
      next(error);
    }
  }

  async getStock(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.getStock(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listarRepuestosModelo(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await productosService.listarRepuestosModelo(req.params.modeloId);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const productosController = new ProductosController();
