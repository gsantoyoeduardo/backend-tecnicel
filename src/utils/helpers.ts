import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types/api.types';

export function successResponse<T>(res: Response, data: T, message?: string, status: number = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  res.status(status).json(body);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number }
): void {
  const body: PaginatedResponse<T> = {
    success: true,
    data,
    pagination,
  };
  res.status(200).json(body);
}

export function errorResponse(res: Response, message: string, status: number = 400): void {
  res.status(status).json({
    success: false,
    error: message,
  });
}

export function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
