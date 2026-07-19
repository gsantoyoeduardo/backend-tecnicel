import { Router } from 'express';
import { pagosController } from '../controllers/pagos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/mis-pagos', roleMiddleware('cliente'), pagosController.misPagos);

router.get('/', roleMiddleware('administrador', 'recepcionista'), pagosController.listar);
router.get('/:id', roleMiddleware('administrador', 'recepcionista'), pagosController.obtenerPorId);
router.get('/:id/comprobante', roleMiddleware('administrador', 'recepcionista'), pagosController.getComprobante);

router.post('/solicitudes/:id/pagos', pagosController.crear);

router.patch('/:id/confirmar', roleMiddleware('administrador', 'recepcionista'), pagosController.confirmar);
router.patch('/:id/anular', roleMiddleware('administrador', 'recepcionista'), pagosController.anular);

export { router as pagosRoutes };
