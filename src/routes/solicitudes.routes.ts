import { Router } from 'express';
import { solicitudesController } from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createSolicitudSchema, updateSolicitudSchema } from '../utils/validators/solicitud.validator';

const router = Router();

router.get('/tracking/:codigo', solicitudesController.trackingPublico);

router.use(authMiddleware);
router.use(roleMiddleware('cliente'));

router.get('/mis-solicitudes', solicitudesController.misSolicitudes);
router.get('/mis-solicitudes/:id', solicitudesController.obtenerMiSolicitud);

router.post(
  '/',
  validate(createSolicitudSchema),
  solicitudesController.crear,
);

router.patch(
  '/:id',
  validate(updateSolicitudSchema),
  solicitudesController.editar,
);

router.patch('/:id/cancelar', solicitudesController.cancelar);

export { router as solicitudesRoutes };
