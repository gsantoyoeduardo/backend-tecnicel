import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';
import { env } from '../config/env';
import { AppError, NotFoundError, UnauthorizedError } from '../utils/errors';

export class AuthService {
  async registroCliente(data: {
    email: string;
    password: string;
    nombre: string;
    apellido: string;
    telefono?: string;
    tipo_documento?: string;
    numero_documento?: string;
  }) {
    const { data: existing, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', data.email)
      .maybeSingle();

    if (checkError) throw new AppError('Error al verificar email', 500);
    if (existing) throw new AppError('El email ya esta registrado', 409);

    const passwordHash = await bcrypt.hash(data.password, 10);

    const { data: rolCliente } = await supabase
      .from('roles')
      .select('id')
      .eq('nombre', 'cliente')
      .single();

    if (!rolCliente) throw new AppError('Rol cliente no encontrado', 500);

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .insert({
        email: data.email,
        password_hash: passwordHash,
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono || null,
        rol_id: rolCliente.id,
        estado: 'activo',
      })
      .select('*')
      .single();

    if (userError) throw new AppError(`Error al registrar: ${userError.message}`, 500);

    const { error: clienteError } = await supabase
      .from('clientes')
      .insert({
        usuario_id: usuario.id,
        tipo_documento: data.tipo_documento || 'dni',
        numero_documento: data.numero_documento || null,
      });

    if (clienteError) throw new AppError(`Error al crear cliente: ${clienteError.message}`, 500);

    const token = this.generateToken(usuario.id, usuario.email, 'cliente', []);
    const refreshToken = this.generateRefreshToken(usuario.id);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: 'cliente',
      },
      token,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, email, password_hash, nombre, apellido, estado, rol_id, roles!inner(nombre)')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      throw new UnauthorizedError('Credenciales invalidas');
    }
    
    if (usuario.estado !== 'activo') throw new UnauthorizedError('Usuario inactivo');

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      throw new UnauthorizedError('Credenciales invalidas');
    }

    const permisos = await this.getPermisosUsuario(usuario.rol_id);
    const rolNombre = (usuario.roles as any)?.nombre || 'cliente';

    const token = this.generateToken(usuario.id, usuario.email, rolNombre, permisos);
    const refreshToken = this.generateRefreshToken(usuario.id);

    return {
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: rolNombre,
      },
      token,
      refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET + '_refresh') as any;

      const { data: usuario } = await supabase
        .from('usuarios')
        .select('id, email, rol_id, roles!inner(nombre)')
        .eq('id', decoded.sub)
        .single();

      if (!usuario) throw new UnauthorizedError('Usuario no encontrado');

      const permisos = await this.getPermisosUsuario(usuario.rol_id);
      const rolNombre = (usuario.roles as any)?.nombre || 'cliente';

      const newToken = this.generateToken(usuario.id, usuario.email, rolNombre, permisos);

      return { token: newToken };
    } catch (error) {
      throw new UnauthorizedError('Refresh token invalido');
    }
  }

  async recuperarContrasena(email: string) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    return { message: 'Si el email esta registrado, recibiras instrucciones de recuperacion' };
  }

  async restablecerContrasena(token: string, newPassword: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as any;
      const passwordHash = await bcrypt.hash(newPassword, 10);

      const { error } = await supabase
        .from('usuarios')
        .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
        .eq('id', decoded.sub);

      if (error) throw new AppError('Error al restablecer contraseña', 500);

      return { message: 'Contraseña actualizada correctamente' };
    } catch (error) {
      throw new AppError('Token invalido o expirado', 400);
    }
  }

  async getPerfil(userId: string) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, telefono, estado, rol_id, roles(nombre)')
      .eq('id', userId)
      .single();

    if (error || !usuario) throw new NotFoundError('Usuario no encontrado');

    return usuario;
  }

  async getPermisosUsuario(rolId: string) {
    const { data } = await supabase
      .from('roles_permisos')
      .select('permisos(nombre)')
      .eq('rol_id', rolId);

    return (data || []).map((rp: any) => rp.permisos?.nombre).filter(Boolean);
  }

  private generateToken(id: string, email: string, rol: string, permisos: string[]) {
    return jwt.sign(
      { id, email, rol, permisos },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN } as any
    );
  }

  private generateRefreshToken(id: string) {
    return jwt.sign(
      { sub: id, type: 'refresh' },
      env.JWT_SECRET + '_refresh',
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as any
    );
  }
}

export const authService = new AuthService();
