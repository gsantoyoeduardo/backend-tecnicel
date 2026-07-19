import { Router } from 'express';
import { dispositivosController } from '../controllers/dispositivos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('cliente'));

router.get('/', dispositivosController.misDispositivos);
router.get('/:id', dispositivosController.obtenerPorId);

router.post(
  '/',
  validate(
    z.object({
      modeloId: z.string().uuid('modeloId invalido'),
      imei: z.string().optional(),
      color: z.string().optional(),
      alias: z.string().optional(),
    }),
  ),
  dispositivosController.crear,
);

router.patch(
  '/:id',
  validate(
    z.object({
      modeloId: z.string().uuid().optional(),
      imei: z.string().optional(),
      color: z.string().optional(),
      alias: z.string().optional(),
    }),
  ),
  dispositivosController.editar,
);

router.delete('/:id', dispositivosController.eliminar);
router.get('/:id/historial', dispositivosController.historial);

export { router as dispositivosRoutes };
