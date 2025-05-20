import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      // Verificar si el email ya existe
      const usuarioExistente = await this.usuariosRepository.findOne({
        where: { email: createUsuarioDto.email },
      });

      if (usuarioExistente) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }

      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

      // Crear el nuevo usuario
      const nuevoUsuario = this.usuariosRepository.create({
        ...createUsuarioDto,
        password: hashedPassword,
      });

      return await this.usuariosRepository.save(nuevoUsuario);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepository.find({
      select: ['id', 'uuid', 'nombre', 'email', 'rol', 'activo', 'fechaCreacion', 'fechaActualizacion'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      select: ['id', 'uuid', 'nombre', 'email', 'rol', 'activo', 'fechaCreacion', 'fechaActualizacion'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findOneByUuid(uuid: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { uuid },
      select: ['id', 'uuid', 'nombre', 'email', 'rol', 'activo', 'fechaCreacion', 'fechaActualizacion'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con UUID ${uuid} no encontrado`);
    }

    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { email },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si hay una nueva contraseña, encriptarla
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    // Actualizar el usuario
    await this.usuariosRepository.update(id, updateUsuarioDto);

    // Devolver el usuario actualizado
    return this.findOne(id);
  }

  async deactivate(id: number): Promise<Usuario> {
    const usuario = await this.findOne(id);
    
    await this.usuariosRepository.update(id, { activo: false });
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    
    await this.usuariosRepository.delete(id);
  }
}