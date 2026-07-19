import { Request, Response, NextFunction } from 'express';
import { uploadService } from '../services/upload.service';
import { successResponse } from '../utils/helpers';

export class UploadController {
  async subirImagen(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No se proporciono ninguna imagen' });
      }

      const solicitudId = req.body.solicitud_id;
      if (!solicitudId) {
        return res.status(400).json({ success: false, error: 'solicitud_id es requerido' });
      }

      const result = await uploadService.subirImagen(req.file, solicitudId);
      successResponse(res, result, 'Imagen subida exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
