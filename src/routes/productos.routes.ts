import { Router } from 'express';
import { productosController } from '../controllers/productos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/modelos/:modeloId/repuestos', productosController.listarRepuestosModelo);

router.get('/', productosController.listar);
router.get('/:id', productosController.obtenerPorId);
router.get('/:id/stock', productosController.getStock);

router.post(
  '/',
  roleMiddleware('administrador', 'recepcionista'),
  productosController.crear,
);

router.patch(
  '/:id',
  roleMiddleware('administrador', 'recepcionista'),
  productosController.editar,
);

router.patch(
  '/:id/estado',
  roleMiddleware('administrador', 'recepcionista'),
  productosController.cambiarEstado,
);

router.delete(
  '/:id',
  roleMiddleware('administrador', 'recepcionista'),
  productosController.eliminar,
);

export { router as productosRoutes };
