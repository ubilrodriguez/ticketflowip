export interface ITicket {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'abierto' | 'en_proceso' | 'cerrado';
  prioridad: 'baja' | 'media' | 'alta';
  categoria: string;
  usuarioId: string;
  asignadoA?: string;
  createdAt: string;
  updatedAt: string;
  comentarios?: IComentario[];
}

export interface IComentario {
  id: string;
  contenido: string;
  usuarioId: string;
  nombreUsuario?: string;
  ticketId: string;
  createdAt: string;
}

export interface ITicketFormData {
  titulo: string;
  descripcion: string;
  categoria: string;
  prioridad: 'baja' | 'media' | 'alta';
}

export interface ITicketFilter {
  estado?: 'abierto' | 'en_proceso' | 'cerrado';
  prioridad?: 'baja' | 'media' | 'alta';
  categoria?: string;
  asignadoA?: string;
  createdBy?: string;
  searchTerm?: string;
}

export interface ITicketQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  filter?: ITicketFilter;
}