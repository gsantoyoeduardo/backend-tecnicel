import { Router } from 'express';
import { inventarioController } from '../controllers/inventario.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('administrador', 'recepcionista'));

router.get('/', inventarioController.consultar);
router.get('/movimientos', inventarioController.movimientos);
router.get('/stock-bajo', inventarioController.stockBajo);

router.post('/entrada', inventarioController.registrarEntrada);
router.post('/salida', inventarioController.registrarSalida);
router.post('/ajuste', inventarioController.registrarAjuste);
router.post('/transferir', inventarioController.transferir);

export { router as inventarioRoutes };
