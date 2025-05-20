import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { UsuariosService } from '../usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  /**
   * Crea un nuevo usuario (solo administradores)
   * @param createUsuarioDto Datos del nuevo usuario
   * @returns Usuario creado
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  /**
   * Obtiene todos los usuarios (solo administradores)
   * @returns Lista de usuarios
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  findAll() {
    return this.usuariosService.findAll();
  }

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  /**
   * Busca un usuario por su UUID
   * @param uuid UUID del usuario
   * @returns Usuario encontrado
   */
  @Get('uuid/:uuid')
  @UseGuards(JwtAuthGuard)
  findByUuid(@Param('uuid') uuid: string) {
    // Implementar método findByUuid en el servicio o usar findOne
    // Por ahora, podemos usar findOne si asumimos que también puede buscar por uuid
    return this.usuariosService.findOne(uuid);
  }

  /**
   * Actualiza un usuario
   * @param id ID del usuario
   * @param updateUsuarioDto Datos a actualizar
   * @returns Usuario actualizado
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, updateUsuarioDto);
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param id ID del usuario
   * @returns Confirmación de desactivación
   */
  @Patch(':id/desactivar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  desactivar(@Param('id') id: string) {
    // Implementar método desactivar en el servicio o usar update
    // Por ahora, podemos usar update para cambiar el campo activo a false
    return this.usuariosService.update(id, { activo: false } as UpdateUsuarioDto);
  }

  /**
   * Elimina un usuario (solo administradores)
   * @param id ID del usuario
   * @returns Confirmación de eliminación
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('administrador')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}