import { Router } from 'express';
import { calificacionesController } from '../controllers/calificaciones.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post(
  '/solicitudes/:id/calificacion',
  roleMiddleware('cliente'),
  calificacionesController.calificar,
);

router.post(
  '/solicitudes/:id/reclamo',
  roleMiddleware('cliente'),
  calificacionesController.crearReclamo,
);

router.get(
  '/',
  roleMiddleware('administrador', 'recepcionista'),
  calificacionesController.listar,
);

const reclamosRouter = Router({ mergeParams: true });
reclamosRouter.use(authMiddleware);
reclamosRouter.use(roleMiddleware('administrador', 'recepcionista'));

reclamosRouter.get('/', calificacionesController.listarReclamos);
reclamosRouter.get('/:id', calificacionesController.getReclamo);
reclamosRouter.patch('/:id/estado', calificacionesController.actualizarEstadoReclamo);

export { router as calificacionesRoutes, reclamosRouter as reclamosRoutes };
