import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from '../usuarios.service';
import { UsuariosController } from '../controller/usuarios.controller';
import { Usuario } from '../entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario])
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService] // Importante: exportamos el servicio para usarlo en otros módulos
})
export class UsuariosModule {}