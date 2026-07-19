import { Router } from 'express';
import { ticketController } from '../controllers/ticket.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('recepcionista', 'administrador', 'tecnico'));

router.get('/:id/ticket', ticketController.generarTicket);

export { router as ticketRoutes };
