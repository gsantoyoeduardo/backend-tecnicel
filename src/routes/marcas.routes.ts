import { Router } from 'express';
import { marcasController } from '../controllers/marcas.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.get('/', marcasController.listar);
router.get('/:id', marcasController.obtenerPorId);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(z.object({ nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres') })),
  marcasController.crear,
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(z.object({ nombre: z.string().min(2).optional() })),
  marcasController.editar,
);

router.patch(
  '/:id/estado',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(z.object({ estado: z.string().min(1, 'Estado requerido') })),
  marcasController.cambiarEstado,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  marcasController.eliminar,
);

export { router as marcasRoutes };
