import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(() => Usuario, usuario => usuario.notificaciones)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ length: 200 })
  titulo: string;

  @Column('text')
  mensaje: string;

  @Column({ length: 50 })
  tipo: string;

  @Column({ default: false })
  leida: boolean;

  @CreateDateColumn()
  creado_en: Date;
}