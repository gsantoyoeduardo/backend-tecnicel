import { supabase } from '../config/supabase';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export class UploadService {
  async subirImagen(file: Express.Multer.File, solicitudId: string) {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${solicitudId}/${Date.now()}.${fileExt}`;
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'estado-dispositivos';

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new AppError(`Error al subir imagen: ${error.message}`, 500);

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  }

  async eliminarImagen(path: string) {
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'estado-dispositivos';

    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw new AppError(`Error al eliminar imagen: ${error.message}`, 500);
    return true;
  }
}

export const uploadService = new UploadService();
