import { Router } from 'express';
import { diagnosticosController } from '../controllers/diagnosticos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/solicitudes/:id/diagnostico', diagnosticosController.getBySolicitud);

router.post(
  '/solicitudes/:id/diagnostico',
  roleMiddleware('tecnico', 'administrador'),
  diagnosticosController.crear,
);

router.patch('/diagnosticos/:id', diagnosticosController.actualizar);

router.post('/diagnosticos/:id/evidencias', diagnosticosController.addEvidencia);

router.delete('/diagnosticos/:id/evidencias/:evidenciaId', diagnosticosController.deleteEvidencia);

export { router as diagnosticosRoutes };
