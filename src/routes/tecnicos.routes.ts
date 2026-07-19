import { Router } from 'express';
import { tecnicosController } from '../controllers/tecnicos.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/tecnicos', roleMiddleware('administrador'), tecnicosController.listar);
router.get('/tecnicos/:id', roleMiddleware('administrador'), tecnicosController.obtenerPorId);
router.post('/tecnicos', roleMiddleware('administrador'), tecnicosController.crear);
router.patch('/tecnicos/:id', roleMiddleware('administrador'), tecnicosController.editar);
router.get('/tecnicos/:id/servicios', roleMiddleware('administrador'), tecnicosController.getServicios);
router.post('/tecnicos/:id/servicios', roleMiddleware('administrador'), tecnicosController.asignarServicios);
router.get('/tecnicos/:id/disponibilidad', roleMiddleware('administrador'), tecnicosController.getDisponibilidad);
router.get('/tecnicos/:id/asignaciones', roleMiddleware('administrador'), tecnicosController.getAsignaciones);

router.get('/tecnico/mis-servicios', roleMiddleware('tecnico'), tecnicosController.misServicios);
router.post('/tecnico/mis-servicios/:solicitudId/iniciar-atencion', roleMiddleware('tecnico'), tecnicosController.iniciarAtencion);
router.patch('/tecnico/mis-servicios/:solicitudId/cambiar-estado', roleMiddleware('tecnico'), tecnicosController.cambiarEstado);
router.post('/tecnico/mis-servicios/:solicitudId/registrar-diagnostico', roleMiddleware('tecnico'), tecnicosController.registrarDiagnostico);
router.post('/tecnico/mis-servicios/:solicitudId/subir-evidencias', roleMiddleware('tecnico'), tecnicosController.subirEvidencias);
router.post('/tecnico/mis-servicios/:solicitudId/finalizar-atencion', roleMiddleware('tecnico'), tecnicosController.finalizarAtencion);

export { router as tecnicosRoutes };
