import { Router } from 'express';
import { estadoDispositivoController } from '../controllers/estado-dispositivo.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createEstadoDispositivoSchema, updateEstadoDispositivoSchema } from '../utils/validators/estado-dispositivo.validator';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('tecnico', 'administrador'));

router.post(
  '/:id/estado',
  validate(createEstadoDispositivoSchema),
  estadoDispositivoController.crear
);

router.get('/:id/estado', estadoDispositivoController.obtenerPorSolicitud);

router.get('/:id/estado/:tipo', estadoDispositivoController.obtenerPorTipo);

router.put(
  '/:id/estado/:tipo',
  validate(updateEstadoDispositivoSchema),
  estadoDispositivoController.actualizar
);

export { router as estadoDispositivoRoutes };
