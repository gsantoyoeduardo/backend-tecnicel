import { Router } from 'express';
import { modelosController } from '../controllers/modelos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.get('/', modelosController.listar);
router.get('/:id', modelosController.obtenerPorId);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      marcaId: z.string().uuid('marcaId invalido'),
      nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
      anio: z.string().optional(),
    }),
  ),
  modelosController.crear,
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      marcaId: z.string().uuid().optional(),
      nombre: z.string().min(2).optional(),
      anio: z.string().optional(),
    }),
  ),
  modelosController.editar,
);

router.patch(
  '/:id/estado',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(z.object({ estado: z.string().min(1, 'Estado requerido') })),
  modelosController.cambiarEstado,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  modelosController.eliminar,
);

const marcasModelosRouter = Router();

marcasModelosRouter.get('/marcas/:marcaId/modelos', modelosController.listarPorMarca);

export { router as modelosRoutes, marcasModelosRouter as marcasModelosRoutes };
