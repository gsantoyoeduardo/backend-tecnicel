import { Router } from 'express';
import { clientesController } from '../controllers/clientes.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createClienteSchema,
  updateClienteSchema,
  createDireccionSchema,
  updateDireccionSchema,
  registroRapidoSchema,
} from '../utils/validators/cliente.validator';

const router = Router();

router.use(authMiddleware);

router.get('/', roleMiddleware('administrador', 'recepcionista'), clientesController.listar);
router.get('/:id', clientesController.obtenerPorId);
router.post('/', validate(createClienteSchema), clientesController.crear);
router.post(
  '/registro-rapido',
  roleMiddleware('administrador', 'recepcionista'),
  validate(registroRapidoSchema),
  clientesController.registroRapido
);
router.patch('/:id', validate(updateClienteSchema), clientesController.actualizar);
router.get('/:id/solicitudes', clientesController.getSolicitudes);
router.get('/:id/dispositivos', clientesController.getDispositivos);
router.get('/:id/direcciones', clientesController.getDirecciones);
router.post('/:id/direcciones', validate(createDireccionSchema), clientesController.createDireccion);

const direccionesRouter = Router();
direccionesRouter.use(authMiddleware);
direccionesRouter.patch('/:id', validate(updateDireccionSchema), clientesController.updateDireccion);
direccionesRouter.delete('/:id', clientesController.deleteDireccion);

export { router as clientesRoutes, direccionesRouter as direccionesRoutes };
