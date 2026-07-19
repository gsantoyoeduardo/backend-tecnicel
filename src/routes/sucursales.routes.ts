import { Router } from 'express';
import { sucursalesController } from '../controllers/sucursales.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/sucursales', sucursalesController.listar);
router.get('/sucursales/:id', sucursalesController.obtenerPorId);
router.post('/sucursales', roleMiddleware('administrador'), sucursalesController.crear);
router.patch('/sucursales/:id', roleMiddleware('administrador'), sucursalesController.editar);
router.patch('/sucursales/:id/estado', roleMiddleware('administrador'), sucursalesController.cambiarEstado);

router.get('/sucursales/:id/horarios', sucursalesController.getHorarios);
router.post('/sucursales/:id/horarios', roleMiddleware('administrador'), sucursalesController.configurarHorarios);

export { router as sucursalesRoutes };
