import { Router } from 'express';
import { cotizacionesController } from '../controllers/cotizaciones.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get(
  '/cotizaciones',
  roleMiddleware('administrador', 'recepcionista'),
  cotizacionesController.listar,
);

router.get('/cotizaciones/:id', cotizacionesController.obtenerPorId);

router.get(
  '/mis-solicitudes/:id/cotizacion',
  roleMiddleware('cliente'),
  cotizacionesController.getBySolicitud,
);

router.post(
  '/solicitudes/:id/cotizacion',
  roleMiddleware('administrador', 'recepcionista'),
  cotizacionesController.crear,
);

router.patch('/cotizaciones/:id', cotizacionesController.editar);

router.post('/cotizaciones/:id/enviar', cotizacionesController.enviar);

router.post(
  '/mis-solicitudes/:id/aprobar-cotizacion',
  roleMiddleware('cliente'),
  cotizacionesController.aprobar,
);

router.post(
  '/mis-solicitudes/:id/rechazar-cotizacion',
  roleMiddleware('cliente'),
  cotizacionesController.rechazar,
);

router.get('/cotizaciones/:id/pdf', cotizacionesController.pdf);

export { router as cotizacionesRoutes };
