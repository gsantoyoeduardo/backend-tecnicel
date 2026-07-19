import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('administrador', 'recepcionista'));

router.get('/resumen', dashboardController.resumen);
router.get('/solicitudes-por-estado', dashboardController.solicitudesPorEstado);
router.get('/servicios-mas-solicitados', dashboardController.serviciosMasSolicitados);
router.get('/ingresos', dashboardController.ingresos);
router.get('/rendimiento-tecnicos', dashboardController.rendimientoTecnicos);

const reportesRouter = Router({ mergeParams: true });
reportesRouter.use(authMiddleware);
reportesRouter.use(roleMiddleware('administrador', 'recepcionista'));

reportesRouter.get('/servicios', dashboardController.reporteServicios);
reportesRouter.get('/inventario', dashboardController.reporteInventario);
reportesRouter.get('/clientes', dashboardController.reporteClientes);
reportesRouter.get('/ventas', dashboardController.reporteVentas);

export { router as dashboardRoutes, reportesRouter as reportesRoutes };
