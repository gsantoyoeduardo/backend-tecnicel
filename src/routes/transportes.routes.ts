import { Router } from 'express';
import { transportesController } from '../controllers/transportes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/transportes', roleMiddleware('administrador', 'repartidor'), transportesController.listar);
router.get('/transportes/:id', roleMiddleware('administrador', 'repartidor'), transportesController.obtenerPorId);
router.patch('/transportes/:id', roleMiddleware('administrador'), transportesController.editar);
router.post('/transportes/:id/iniciar', roleMiddleware('repartidor', 'administrador'), transportesController.iniciar);
router.post('/transportes/:id/confirmar-recojo', roleMiddleware('repartidor', 'administrador'), transportesController.confirmarRecojo);
router.post('/transportes/:id/confirmar-entrega', roleMiddleware('repartidor', 'administrador'), transportesController.confirmarEntrega);
router.post('/transportes/:id/ubicacion', roleMiddleware('repartidor', 'administrador'), transportesController.enviarUbicacion);
router.get('/transportes/:id/ubicacion', roleMiddleware('administrador', 'repartidor'), transportesController.getUbicacion);

router.post('/solicitudes/:id/programar-recojo', roleMiddleware('administrador'), transportesController.programarRecojo);
router.post('/solicitudes/:id/programar-entrega', roleMiddleware('administrador'), transportesController.programarEntrega);

export { router as transportesRoutes };
