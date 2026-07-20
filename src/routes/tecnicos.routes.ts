import { Router } from 'express';
import { tecnicosController } from '../controllers/tecnicos.controller';
import { solicitudesController } from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

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
router.get('/tecnico/mis-ordenes', roleMiddleware('tecnico'), tecnicosController.misOrdenes);
router.post('/tecnico/mis-servicios/:solicitudId/iniciar-atencion', roleMiddleware('tecnico'), tecnicosController.iniciarAtencion);
router.patch('/tecnico/mis-servicios/:solicitudId/cambiar-estado', roleMiddleware('tecnico'), tecnicosController.cambiarEstado);
router.post('/tecnico/mis-servicios/:solicitudId/registrar-diagnostico', roleMiddleware('tecnico'), tecnicosController.registrarDiagnostico);
router.post('/tecnico/mis-servicios/:solicitudId/subir-evidencias', roleMiddleware('tecnico'), tecnicosController.subirEvidencias);
router.post('/tecnico/mis-servicios/:solicitudId/finalizar-atencion', roleMiddleware('tecnico'), tecnicosController.finalizarAtencion);

router.patch('/tecnico/orden/:ordenId/estado', roleMiddleware('tecnico'), solicitudesController.cambiarEstadoTecnico);

router.post(
  '/tecnico/orden/:ordenId/dispositivo/:dispositivoId/estado-inicial',
  roleMiddleware('tecnico'),
  validate(
    z.object({
      estado_general: z.string().optional(),
      bateria: z.number().min(0).max(100).optional(),
      accesorios: z.array(z.string()).optional(),
      fotos: z.array(z.string()).optional(),
      notas: z.string().optional(),
    })
  ),
  tecnicosController.registrarEstadoInicial
);

export { router as tecnicosRoutes };
