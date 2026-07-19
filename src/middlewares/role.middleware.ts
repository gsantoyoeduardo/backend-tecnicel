import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../utils/errors';

export function roleMiddleware(...rolesPermitidos: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new ForbiddenError('Usuario no autenticado');
    }

    if (rolesPermitidos.length === 0) {
      next();
      return;
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      throw new ForbiddenError('No tienes permisos para realizar esta accion');
    }

    next();
  };
}
