import { Router } from 'express';
import { reparacionesController } from '../controllers/reparaciones.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', reparacionesController.listar);
router.get('/:id', reparacionesController.obtenerPorId);

router.post(
  '/',
  roleMiddleware('administrador', 'tecnico'),
  reparacionesController.iniciar,
);

router.patch('/:id', reparacionesController.actualizar);
router.patch('/:id/finalizar', reparacionesController.finalizar);

router.post('/:id/repuestos', reparacionesController.agregarRepuesto);
router.delete('/:id/repuestos/:detalleId', reparacionesController.quitarRepuesto);

router.post('/:id/evidencias', reparacionesController.agregarEvidencia);

router.post('/:id/control-calidad', reparacionesController.registrarControlCalidad);

export { router as reparacionesRoutes };
