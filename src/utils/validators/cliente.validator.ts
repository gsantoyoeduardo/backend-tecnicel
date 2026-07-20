import { z } from 'zod';

export const createClienteSchema = z.object({
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
  usuario_id: z.string().uuid('usuario_id invalido'),
  fecha_nacimiento: z.string().optional(),
});

export const registroRapidoSchema = z.object({
  email: z.string().email('Email invalido'),
  nombre: z.string().min(2, 'Minimo 2 caracteres'),
  apellido: z.string().min(2, 'Minimo 2 caracteres'),
  telefono: z.string().optional(),
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
});

export const updateClienteSchema = z.object({
  tipo_documento: z.string().optional(),
  numero_documento: z.string().optional(),
  fecha_nacimiento: z.string().optional(),
});

export const createDireccionSchema = z.object({
  direccion: z.string().min(1, 'Direccion requerida'),
  distrito: z.string().optional(),
  provincia: z.string().optional(),
  departamento: z.string().optional(),
  referencia: z.string().optional(),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
  es_principal: z.boolean().optional(),
});

export const updateDireccionSchema = z.object({
  direccion: z.string().min(1).optional(),
  distrito: z.string().optional(),
  provincia: z.string().optional(),
  departamento: z.string().optional(),
  referencia: z.string().optional(),
  latitud: z.string().optional(),
  longitud: z.string().optional(),
  es_principal: z.boolean().optional(),
});
