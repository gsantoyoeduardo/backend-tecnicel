import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/helpers';

export class AuthController {
  async registroCliente(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.registroCliente(req.body);
      successResponse(res, result, 'Cliente registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body.email, req.body.password);
      successResponse(res, result, 'Inicio de sesion exitoso');
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      successResponse(res, result, 'Token renovado');
    } catch (error) {
      next(error);
    }
  }

  async recuperarContrasena(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.recuperarContrasena(req.body.email);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async restablecerContrasena(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.restablecerContrasena(
        req.body.token,
        req.body.newPassword
      );
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response, next: NextFunction) {
    try {
      successResponse(res, null, 'Sesion cerrada exitosamente');
    } catch (error) {
      next(error);
    }
  }

  async perfil(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.getPerfil(req.user!.id);
      successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
