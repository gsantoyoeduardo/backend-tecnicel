import { z } from 'zod';

export const createSolicitudSchema = z.object({
  dispositivo_id: z.string().uuid('dispositivo_id invalido'),
  servicio_id: z.string().uuid('servicio_id invalido'),
  descripcion_problema: z.string().optional(),
  modalidad: z.enum(['sucursal', 'domicilio', 'recojo_entrega'], {
    errorMap: () => ({ message: 'Modalidad debe ser sucursal, domicilio o recojo_entrega' }),
  }),
  direccion_id: z.string().uuid().optional(),
  sucursal_id: z.string().uuid().optional(),
  fecha_preferida: z.string().optional(),
  horario_preferido: z.string().optional(),
});

export const updateSolicitudSchema = z.object({
  dispositivo_id: z.string().uuid().optional(),
  servicio_id: z.string().uuid().optional(),
  descripcion_problema: z.string().optional(),
  modalidad: z.enum(['sucursal', 'domicilio', 'recojo_entrega']).optional(),
  direccion_id: z.string().uuid().optional(),
  sucursal_id: z.string().uuid().optional(),
  fecha_preferida: z.string().optional(),
  horario_preferido: z.string().optional(),
});

export const cambiarEstadoSchema = z.object({
  estado: z.string().min(1, 'Estado requerido'),
  comentario: z.string().optional(),
});

export const asignarSchema = z.object({
  usuario_id: z.string().uuid('usuario_id invalido'),
});
