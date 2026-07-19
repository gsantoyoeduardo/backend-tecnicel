import { Router } from 'express';
import { categoriasServicioController } from '../controllers/categorias-servicio.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.get('/', categoriasServicioController.listar);
router.get('/:id', categoriasServicioController.obtenerPorId);

router.post(
  '/',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
      descripcion: z.string().optional(),
    }),
  ),
  categoriasServicioController.crear,
);

router.patch(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador', 'recepcionista'),
  validate(
    z.object({
      nombre: z.string().min(2).optional(),
      descripcion: z.string().optional(),
    }),
  ),
  categoriasServicioController.editar,
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware('administrador'),
  categoriasServicioController.eliminar,
);

export { router as categoriasServicioRoutes };
