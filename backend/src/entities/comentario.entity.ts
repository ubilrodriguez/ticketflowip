import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Ticket } from './ticket.entity';

@Entity('comentarios')
export class Comentario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, ticket => ticket.comentarios)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  // @ManyToOne(() => Usuario, usuario => usuario.comentarios)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column('text')
  mensaje: string;

  @Column({ default: false })
  es_interno: boolean;

  @CreateDateColumn()
  creado_en: Date;
}