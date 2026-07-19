import { Request, Response, NextFunction } from 'express';
import { inventarioService } from '../services/inventario.service';
import { successResponse } from '../utils/helpers';

export class InventarioController {
  async consultar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.consultar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async movimientos(req: Request, res: Response, next: NextFunction) {
    try {
      const { productoId, sucursalId, tipo } = req.query as {
        productoId?: string;
        sucursalId?: string;
        tipo?: string;
      };
      const data = await inventarioService.movimientos({ productoId, sucursalId, tipo });
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async registrarEntrada(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.registrarEntrada(
        req.body.productoId,
        req.body.sucursalId,
        req.body.cantidad,
        req.body.motivo,
        req.body.usuarioId || req.user?.id,
      );
      successResponse(res, data, 'Entrada registrada', 201);
    } catch (error) {
      next(error);
    }
  }

  async registrarSalida(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.registrarSalida(
        req.body.productoId,
        req.body.sucursalId,
        req.body.cantidad,
        req.body.motivo,
        req.body.usuarioId || req.user?.id,
      );
      successResponse(res, data, 'Salida registrada', 201);
    } catch (error) {
      next(error);
    }
  }

  async registrarAjuste(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.registrarAjuste(
        req.body.productoId,
        req.body.sucursalId,
        req.body.cantidad,
        req.body.motivo,
        req.body.usuarioId || req.user?.id,
      );
      successResponse(res, data, 'Ajuste registrado', 201);
    } catch (error) {
      next(error);
    }
  }

  async transferir(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.transferir(
        req.body.productoId,
        req.body.sucursalOrigenId,
        req.body.sucursalDestinoId,
        req.body.cantidad,
        req.body.usuarioId || req.user?.id,
      );
      successResponse(res, data, 'Transferencia realizada', 201);
    } catch (error) {
      next(error);
    }
  }

  async stockBajo(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await inventarioService.stockBajo();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }
}

export const inventarioController = new InventarioController();
