import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Comentario } from './comentario.entity';
import { ArchivoAdjunto } from './archivo-adjunto.entity';

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  numero_ticket: string;

  @Column({ length: 200 })
  titulo: string;

  @Column('text')
  descripcion: string;

  @Column({
    type: 'enum',
    enum: ['abierto', 'en_progreso', 'resuelto', 'cerrado'],
    default: 'abierto'
  })
  estado: string;

  @Column({
    type: 'enum',
    enum: ['Alta', 'Media', 'Baja'],
    default: 'Media'
  })
  prioridad: string;

  @Column({ length: 50 })
  categoria: string;

  // @ManyToOne(() => Usuario, usuario => usuario.tickets_creados)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Usuario;

  // @ManyToOne(() => Usuario, usuario => usuario.tickets_asignados, { nullable: true })
  // @JoinColumn({ name: 'asignado_id' })
  // asignado: Usuario;

  @OneToMany(() => Comentario, comentario => comentario.ticket)
  comentarios: Comentario[];

  @OneToMany(() => ArchivoAdjunto, archivo => archivo.ticket)
  archivos: ArchivoAdjunto[];

  @CreateDateColumn()
  creado_en: Date;

  @UpdateDateColumn()
  actualizado_en: Date;
}