import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../usuarios/dto/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const usuario = await this.usuariosService.findOneByEmail(email);
      
      if (!usuario) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!usuario.activo) {
        throw new UnauthorizedException('Este usuario ha sido desactivado');
      }

      const isPasswordValid = await bcrypt.compare(password, usuario.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      const { password: _, ...result } = usuario;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      rol: user.rol,
      uuid: user.uuid
    };
    
    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        uuid: user.uuid
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  async getProfile(userId: number) {
    return this.usuariosService.findOne(userId);
  }
}