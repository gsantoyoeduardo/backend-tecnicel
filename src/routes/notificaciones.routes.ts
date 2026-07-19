import { Router } from 'express';
import { notificacionesController } from '../controllers/notificaciones.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', notificacionesController.getNotificaciones);

router.patch('/:id/leida', notificacionesController.marcarLeida);
router.patch('/marcar-todas-leidas', notificacionesController.marcarTodasLeidas);

router.post(
  '/',
  roleMiddleware('administrador', 'recepcionista'),
  notificacionesController.crearNotificacion,
);

router.post('/token', notificacionesController.registrarToken);

router.post(
  '/rol',
  roleMiddleware('administrador'),
  notificacionesController.crearNotificacionPorRol,
);

export { router as notificacionesRoutes };
