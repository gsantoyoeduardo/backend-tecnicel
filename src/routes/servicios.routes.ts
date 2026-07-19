import { Router } from 'express';
import { serviciosController } from '../controllers/servicios.controller';
import { serviciosModelosController } from '../controllers/servicios-modelos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.get('/', serviciosController.listar);
router.get('/:id', serviciosController.obtenerPorId);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
      categoria_id: z.string().uuid().optional(),
      descripcion: z.string().optional(),
      precio_base: z.number().positive().optional(),
      duracion_estimada_minutos: z.number().int().positive().optional(),
      permite_domicilio: z.boolean().optional(),
      permite_recojo: z.boolean().optional(),
      permite_sucursal: z.boolean().optional(),
    }),
  ),
  serviciosController.crear,
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      nombre: z.string().min(2).optional(),
      categoria_id: z.string().uuid().optional(),
      descripcion: z.string().optional(),
      precio_base: z.number().positive().optional(),
      duracion_estimada_minutos: z.number().int().positive().optional(),
      permite_domicilio: z.boolean().optional(),
      permite_recojo: z.boolean().optional(),
      permite_sucursal: z.boolean().optional(),
    }),
  ),
  serviciosController.editar,
);

router.patch(
  '/:id/estado',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(z.object({ estado: z.string().min(1, 'Estado requerido') })),
  serviciosController.cambiarEstado,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  serviciosController.eliminar,
);

router.get(
  '/modelos/:modeloId/servicios',
  serviciosModelosController.listarPorModelo,
);

export { router as serviciosRoutes };
