import { z } from 'zod';

export const createEstadoDispositivoSchema = z.object({
  tipo: z.enum(['ingreso', 'salida']),
  estado_general: z.string().optional(),
  pantalla_estado: z.string().optional(),
  carcasa_estado: z.string().optional(),
  botones_estado: z.string().optional(),
  camara_estado: z.string().optional(),
  audio_estado: z.string().optional(),
  carga_bateria: z.number().min(0).max(100).optional(),
  accesorios_entregados: z.array(z.string()).optional(),
  fotos: z.array(z.string()).optional(),
  observaciones: z.string().optional(),
  observaciones_adicionales: z.string().optional(),
});

export const updateEstadoDispositivoSchema = z.object({
  estado_general: z.string().optional(),
  pantalla_estado: z.string().optional(),
  carcasa_estado: z.string().optional(),
  botones_estado: z.string().optional(),
  camara_estado: z.string().optional(),
  audio_estado: z.string().optional(),
  carga_bateria: z.number().min(0).max(100).optional(),
  accesorios_entregados: z.array(z.string()).optional(),
  fotos: z.array(z.string()).optional(),
  observaciones: z.string().optional(),
  observaciones_adicionales: z.string().optional(),
});
