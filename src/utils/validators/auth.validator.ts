import { z } from 'zod';

export const registroClienteSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  nombre: z.string().min(2, 'Minimo 2 caracteres'),
  apellido: z.string().min(2, 'Minimo 2 caracteres'),
  telefono: z.string().optional(),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Password requerido'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token requerido'),
});

export const recuperarContrasenaSchema = z.object({
  email: z.string().email('Email invalido'),
});

export const restablecerContrasenaSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  newPassword: z.string().min(6, 'Minimo 6 caracteres'),
});

export const crearUsuarioSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(6, 'Minimo 6 caracteres'),
  nombre: z.string().min(2),
  apellido: z.string().min(2),
  telefono: z.string().optional(),
  rol_id: z.string().uuid('Rol invalido'),
});

export const editarUsuarioSchema = z.object({
  nombre: z.string().min(2).optional(),
  apellido: z.string().min(2).optional(),
  telefono: z.string().optional(),
  rol_id: z.string().uuid().optional(),
});

export const cambiarEstadoUsuarioSchema = z.object({
  estado: z.enum(['activo', 'inactivo']),
});
