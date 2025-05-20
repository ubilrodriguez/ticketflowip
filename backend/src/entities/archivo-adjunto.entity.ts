import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Ticket } from './ticket.entity';

@Entity('archivos_adjuntos')
export class ArchivoAdjunto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Ticket, ticket => ticket.archivos)
  @JoinColumn({ name: 'ticket_id' })
  ticket: Ticket;

  @Column({ length: 255 })
  nombre_archivo: string;

  @Column('text')
  url_archivo: string;

  @Column({ length: 100, nullable: true })
  tipo_archivo: string;

  @Column('bigint', { nullable: true })
  tamaño_bytes: number;

  @CreateDateColumn()
  creado_en: Date;
}