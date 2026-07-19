import { Router } from 'express';
import { solicitudesController } from '../controllers/solicitudes.controller';
import { trackingController } from '../controllers/tracking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { cambiarEstadoSchema, asignarSchema } from '../utils/validators/solicitud.validator';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('administrador', 'recepcionista'));

router.get('/', solicitudesController.listarTodas);
router.get('/:id', solicitudesController.obtenerPorId);
router.get('/:id/historial', solicitudesController.historial);

router.patch('/:id/confirmar', solicitudesController.confirmar);

router.patch(
  '/:id/asignar-tecnico',
  validate(asignarSchema),
  solicitudesController.asignarTecnico,
);

router.patch(
  '/:id/asignar-repartidor',
  validate(asignarSchema),
  solicitudesController.asignarRepartidor,
);

router.patch(
  '/:id/estado',
  validate(cambiarEstadoSchema),
  solicitudesController.cambiarEstado,
);

router.post(
  '/:id/observaciones',
  validate(z.object({ observacion: z.string().min(1, 'Observacion requerida') })),
  solicitudesController.agregarObservacion,
);

router.patch(
  '/:id/cancelar-empresa',
  validate(z.object({ motivo: z.string().min(1, 'Motivo requerido') })),
  solicitudesController.cancelarEmpresa,
);

router.get('/:id/tracking', trackingController.getTracking);
router.post(
  '/:id/tracking',
  validate(
    z.object({
      estado: z.string().min(1, 'Estado requerido'),
      comentario: z.string().optional(),
      latitud: z.string().optional(),
      longitud: z.string().optional(),
    }),
  ),
  trackingController.addEvento,
);

router.get(
  '/:id/ubicacion',
  trackingController.getUbicacionActual,
);

router.post(
  '/:id/ubicacion',
  validate(
    z.object({
      latitud: z.string().min(1, 'Latitud requerida'),
      longitud: z.string().min(1, 'Longitud requerida'),
    }),
  ),
  trackingController.registrarUbicacion,
);

router.get('/:id/ruta', trackingController.getRuta);

export { router as solicitudesAdminRoutes };
