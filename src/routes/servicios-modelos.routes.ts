import { Router } from 'express';
import { serviciosModelosController } from '../controllers/servicios-modelos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.get('/', serviciosModelosController.listar);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      modelo_id: z.string().uuid('modelo_id invalido'),
      servicio_id: z.string().uuid('servicio_id invalido'),
      precio_estimado: z.number().positive().optional(),
      duracion_estimada_minutos: z.number().int().positive().optional(),
      permite_domicilio: z.boolean().optional(),
      permite_recojo: z.boolean().optional(),
      permite_sucursal: z.boolean().optional(),
    }),
  ),
  serviciosModelosController.crear,
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      precio_estimado: z.number().positive().optional(),
      duracion_estimada_minutos: z.number().int().positive().optional(),
      permite_domicilio: z.boolean().optional(),
      permite_recojo: z.boolean().optional(),
      permite_sucursal: z.boolean().optional(),
    }),
  ),
  serviciosModelosController.editar,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  serviciosModelosController.eliminar,
);

router.delete(
  '/modelos/:modeloId/servicios/:servicioId',
  authMiddleware,
  roleMiddleware('administrador'),
  serviciosModelosController.eliminarPorModeloServicio,
);

export { router as serviciosModelosRoutes };
