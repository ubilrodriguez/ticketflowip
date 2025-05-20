import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  /**
   * Valida las credenciales de un usuario
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns El usuario autenticado sin la contraseña
   */
  async validateUser(email: string, password: string): Promise<any> {
    // Buscar al usuario por email
    const usuario = await this.usuariosService.findByEmail(email);

    // Si el usuario existe y la contraseña coincide
    if (usuario && await bcrypt.compare(password, usuario.password)) {
      // Extraer la contraseña del objeto para no devolverla
      const { password, ...result } = usuario;
      return result;
    }
    
    return null;
  }

  /**
   * Genera un token JWT para el usuario autenticado
   * @param usuario Usuario autenticado
   * @returns Token JWT y datos del usuario
   */
  async login(usuario: any) {
    // Payload para el token JWT
    const payload = { 
      sub: usuario.id, 
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol
    };

    // Retornar token y datos del usuario (sin contraseña)
    return {
      user: usuario,
      token: this.jwtService.sign(payload),
    };
  }

  /**
   * Registra un nuevo usuario en el sistema
   * @param createUsuarioDto DTO con los datos del nuevo usuario
   * @returns Usuario creado
   */
  async register(createUsuarioDto: CreateUsuarioDto) {
    // Verificar si el email ya está registrado
    const existingUser = await this.usuariosService.findByEmail(createUsuarioDto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Por defecto, los nuevos registros son clientes
    const nuevoUsuario = {
      ...createUsuarioDto,
      rol: 'cliente',
    };

    // Crear el usuario
    return this.usuariosService.create(nuevoUsuario);
  }

  /**
   * Obtiene el perfil del usuario autenticado
   * @param userId ID del usuario autenticado
   * @returns Datos del usuario sin la contraseña
   */
  async getProfile(userId: string) {
    return this.usuariosService.findOne(userId);
  }
}