import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  registroClienteSchema,
  loginSchema,
  refreshTokenSchema,
  recuperarContrasenaSchema,
  restablecerContrasenaSchema,
} from '../utils/validators/auth.validator';

const router = Router();

router.post('/registro-cliente', validate(registroClienteSchema), authController.registroCliente);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/recuperar-contrasena', validate(recuperarContrasenaSchema), authController.recuperarContrasena);
router.post('/restablecer-contrasena', validate(restablecerContrasenaSchema), authController.restablecerContrasena);
router.post('/logout', authMiddleware, authController.logout);
router.get('/perfil', authMiddleware, authController.perfil);

export { router as authRoutes };
