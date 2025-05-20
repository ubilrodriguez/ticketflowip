import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretoParaDesarrollo',
    });
  }

  /**
   * Valida el token JWT y devuelve el payload decodificado
   * @param payload Payload del token JWT
   * @returns Datos del usuario extraídos del token
   */
  async validate(payload: any) {
    return { 
      userId: payload.sub, 
      email: payload.email,
      nombre: payload.nombre,
      rol: payload.rol
    };
  }
}