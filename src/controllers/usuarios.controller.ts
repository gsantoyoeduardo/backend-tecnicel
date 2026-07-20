import { Request, Response, NextFunction } from 'express';
import { usuariosService } from '../services/usuarios.service';
import { rolesService } from '../services/roles.service';
import { successResponse } from '../utils/helpers';

export class UsuariosController {
  async listar(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async obtenerPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.obtenerPorId(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.crear(req.body);
      successResponse(res, data, 'Usuario creado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }

  async editar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.editar(req.params.id, req.body);
      successResponse(res, data, 'Usuario actualizado');
    } catch (error) {
      next(error);
    }
  }

  async cambiarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.cambiarEstado(req.params.id, req.body.estado);
      successResponse(res, data, 'Estado actualizado');
    } catch (error) {
      next(error);
    }
  }

  async eliminar(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.eliminar(req.params.id);
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async listarRoles(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await rolesService.listar();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async crearRol(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await rolesService.crear(req.body);
      successResponse(res, data, 'Rol creado', 201);
    } catch (error) {
      next(error);
    }
  }

  async editarRol(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await rolesService.editar(req.params.id, req.body);
      successResponse(res, data, 'Rol actualizado');
    } catch (error) {
      next(error);
    }
  }

  async listarPermisos(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await rolesService.listarPermisos();
      successResponse(res, data);
    } catch (error) {
      next(error);
    }
  }

  async asignarPermisos(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await rolesService.asignarPermisos(req.params.id, req.body.permisos);
      successResponse(res, data, 'Permisos actualizados');
    } catch (error) {
      next(error);
    }
  }

  async sincronizarTecnicos(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await usuariosService.sincronizarTecnicos();
      successResponse(res, data, 'Sincronizacion completada');
    } catch (error) {
      next(error);
    }
  }
}

export const usuariosController = new UsuariosController();
