import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  console.error('Error inesperado:', err);

  res.status(500).json({
    success: false,
    error: 'Error interno del servidor',
  });
}
