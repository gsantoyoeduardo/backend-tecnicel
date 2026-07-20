import { Router } from 'express';
import { tecnicosController } from '../controllers/tecnicos.controller';
import { solicitudesController } from '../controllers/solicitudes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('administrador'), tecnicosController.listar);
router.get('/:id', roleMiddleware('administrador'), tecnicosController.obtenerPorId);
router.post('/', roleMiddleware('administrador'), tecnicosController.crear);
router.patch('/:id', roleMiddleware('administrador'), tecnicosController.editar);
router.get('/:id/servicios', roleMiddleware('administrador'), tecnicosController.getServicios);
router.post('/:id/servicios', roleMiddleware('administrador'), tecnicosController.asignarServicios);
router.get('/:id/disponibilidad', roleMiddleware('administrador'), tecnicosController.getDisponibilidad);
router.get('/:id/asignaciones', roleMiddleware('administrador'), tecnicosController.getAsignaciones);

router.get('/mis-servicios', roleMiddleware('tecnico'), tecnicosController.misServicios);
router.get('/mis-ordenes', roleMiddleware('tecnico'), tecnicosController.misOrdenes);
router.post('/mis-servicios/:solicitudId/iniciar-atencion', roleMiddleware('tecnico'), tecnicosController.iniciarAtencion);
router.patch('/mis-servicios/:solicitudId/cambiar-estado', roleMiddleware('tecnico'), tecnicosController.cambiarEstado);
router.post('/mis-servicios/:solicitudId/registrar-diagnostico', roleMiddleware('tecnico'), tecnicosController.registrarDiagnostico);
router.post('/mis-servicios/:solicitudId/subir-evidencias', roleMiddleware('tecnico'), tecnicosController.subirEvidencias);
router.post('/mis-servicios/:solicitudId/finalizar-atencion', roleMiddleware('tecnico'), tecnicosController.finalizarAtencion);

router.patch('/orden/:ordenId/estado', roleMiddleware('tecnico'), solicitudesController.cambiarEstadoTecnico);

router.post(
  '/orden/:ordenId/dispositivo/:dispositivoId/estado-inicial',
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
