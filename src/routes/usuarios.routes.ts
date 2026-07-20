import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  crearUsuarioSchema,
  editarUsuarioSchema,
  cambiarEstadoUsuarioSchema,
} from '../utils/validators/auth.validator';
import { z } from 'zod';

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('administrador'));

router.get('/', usuariosController.listar);
router.get('/:id', usuariosController.obtenerPorId);
router.post('/', validate(crearUsuarioSchema), usuariosController.crear);
router.post('/sincronizar-tecnicos', usuariosController.sincronizarTecnicos);
router.patch('/:id', validate(editarUsuarioSchema), usuariosController.editar);
router.patch('/:id/estado', validate(cambiarEstadoUsuarioSchema), usuariosController.cambiarEstado);
router.delete('/:id', usuariosController.eliminar);

export { router as usuariosRoutes };

const rolesRouter = Router();
rolesRouter.use(authMiddleware);
rolesRouter.use(roleMiddleware('administrador'));

rolesRouter.get('/', usuariosController.listarRoles);
rolesRouter.post('/', validate(z.object({ nombre: z.string().min(2), descripcion: z.string().optional() })), usuariosController.crearRol);
rolesRouter.patch('/:id', validate(z.object({ nombre: z.string().min(2).optional(), descripcion: z.string().optional() })), usuariosController.editarRol);
rolesRouter.get('/:id/permisos', usuariosController.listarPermisos);
rolesRouter.put('/:id/permisos', validate(z.object({ permisos: z.array(z.string().uuid()) })), usuariosController.asignarPermisos);

export { rolesRouter as rolesRoutes };

const permisosRouter = Router();
permisosRouter.use(authMiddleware);
permisosRouter.get('/', usuariosController.listarPermisos);

export { permisosRouter as permisosRoutes };
