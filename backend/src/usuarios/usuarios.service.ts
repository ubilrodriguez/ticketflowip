import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  /**
   * Crea un nuevo usuario
   * @param createUsuarioDto Datos del nuevo usuario
   * @returns Usuario creado
   */
  async create(createUsuarioDto: CreateUsuarioDto) {
    const { password, rol, ...userData } = createUsuarioDto;
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Convertir rol string a enum RolUsuario
    let rolEnum: RolUsuario;
    if (rol === 'administrador') {
      rolEnum = RolUsuario.ADMINISTRADOR;
    } else if (rol === 'agente') {
      rolEnum = RolUsuario.AGENTE;
    } else {
      rolEnum = RolUsuario.CLIENTE;
    }
    
    // Crear la entidad Usuario
    const newUsuario = this.usuarioRepository.create({
      ...userData,
      password: hashedPassword,
      rol: rolEnum,
    });
    
    // Guardar el usuario
    const savedUsuario = await this.usuarioRepository.save(newUsuario);
    
    // Excluir la contraseña del resultado
    const { password: _, ...result } = savedUsuario;
    
    return result;
  }

  /**
   * Obtiene todos los usuarios
   * @returns Lista de usuarios
   */
  async findAll() {
    const usuarios = await this.usuarioRepository.find();
    
    // Excluir las contraseñas del resultado
    return usuarios.map(usuario => {
      const { password, ...result } = usuario;
      return result;
    });
  }

  /**
   * Busca un usuario por ID
   * @param id ID del usuario
   * @returns Usuario encontrado
   */
  async findOne(id: string) {
    // Convertir id a número
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      throw new NotFoundException(`ID inválido: ${id}`);
    }
    
    const usuario = await this.usuarioRepository.findOne({ 
      where: { id: numericId } 
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    return usuario; // Importante: NO eliminar la contraseña aquí para el auth service
  }

  /**
   * Busca un usuario por email (necesario para auth)
   * @param email Email del usuario
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string) {
    return this.usuarioRepository.findOne({ 
      where: { email } 
    });
  }

  /**
   * Busca un usuario por UUID
   * @param uuid UUID del usuario
   * @returns Usuario encontrado
   */
  async findByUuid(uuid: string) {
    const usuario = await this.usuarioRepository.findOne({ 
      where: { uuid }
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con UUID ${uuid} no encontrado`);
    }
    
    // Mantener la contraseña para casos en que el auth service la necesite
    return usuario;
  }

  /**
   * Actualiza un usuario
   * @param id ID del usuario
   * @param updateUsuarioDto Datos a actualizar
   * @returns Usuario actualizado
   */
  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    // Convertir id a número
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      throw new NotFoundException(`ID inválido: ${id}`);
    }
    
    // Buscar primero el usuario para verificar que existe
    const usuario = await this.usuarioRepository.findOne({ 
      where: { id: numericId } 
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Preparar los datos para actualizar
    const updateData: any = { ...updateUsuarioDto };
    
    // Si se incluye una nueva contraseña, la hasheamos
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    // Si se actualiza el rol, convertirlo al enum
    if (updateData.rol) {
      if (updateData.rol === 'administrador') {
        updateData.rol = RolUsuario.ADMINISTRADOR;
      } else if (updateData.rol === 'agente') {
        updateData.rol = RolUsuario.AGENTE;
      } else {
        updateData.rol = RolUsuario.CLIENTE;
      }
    }
    
    // Actualizar el usuario
    await this.usuarioRepository.update(numericId, updateData);
    
    // Obtener el usuario actualizado
    const updatedUsuario = await this.usuarioRepository.findOne({ 
      where: { id: numericId } 
    });
    
    // Excluir la contraseña del resultado
    const { password, ...result } = updatedUsuario;
    return result;
  }

  /**
   * Desactiva un usuario (soft delete)
   * @param id ID del usuario
   * @returns Confirmación de desactivación
   */
  async desactivar(id: string) {
    // Convertir id a número
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      throw new NotFoundException(`ID inválido: ${id}`);
    }
    
    // Actualizar solo el campo 'activo'
    await this.usuarioRepository.update(numericId, { activo: false });
    
    return { success: true, message: `Usuario con ID ${id} desactivado` };
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario
   * @returns Confirmación de eliminación
   */
  async remove(id: string) {
    // Convertir id a número
    const numericId = parseInt(id);
    
    if (isNaN(numericId)) {
      throw new NotFoundException(`ID inválido: ${id}`);
    }
    
    // Buscar primero el usuario para verificar que existe
    const usuario = await this.usuarioRepository.findOne({ 
      where: { id: numericId } 
    });
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    
    // Eliminar el usuario
    await this.usuarioRepository.remove(usuario);
    
    return { success: true, message: `Usuario con ID ${id} eliminado` };
  }
}