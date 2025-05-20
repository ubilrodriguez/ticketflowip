import axios from '../services/api';
import { ITicket, ITicketFormData, ITicketQueryParams } from '../interfaces/ticket';

// Obtener todos los tickets con paginación y filtros
export const getAllTickets = async (queryParams?: ITicketQueryParams): Promise<ITicket[]> => {
  try {
    const params = new URLSearchParams();
    
    if (queryParams) {
      if (queryParams.page) params.append('page', queryParams.page.toString());
      if (queryParams.limit) params.append('limit', queryParams.limit.toString());
      if (queryParams.sort) params.append('sort', queryParams.sort);
      
      if (queryParams.filter) {
        const { estado, prioridad, categoria, asignadoA, createdBy, searchTerm } = queryParams.filter;
        if (estado) params.append('estado', estado);
        if (prioridad) params.append('prioridad', prioridad);
        if (categoria) params.append('categoria', categoria);
        if (asignadoA) params.append('asignadoA', asignadoA);
        if (createdBy) params.append('createdBy', createdBy);
        if (searchTerm) params.append('searchTerm', searchTerm);
      }
    }

    const response = await axios.get('/tickets', { params });
    return response.data;
  } catch (error) {
    // Mejorar el manejo de errores para diagnóstico
    console.error('Error al obtener los tickets:', error);
    
    // Registrar más detalles para ayudar a diagnosticar problemas de API
    if (axios.defaults.baseURL) {
      console.debug('Intentando conectar a:', axios.defaults.baseURL + '/tickets');
    }
    
    throw error;
  }
};

// Resto del código de ticketService.ts se mantiene igual
// Obtener un ticket específico por ID
export const getTicketById = async (id: string): Promise<ITicket> => {
  try {
    const response = await axios.get(`/tickets/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el ticket ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo ticket
export const createTicket = async (ticketData: ITicketFormData): Promise<ITicket> => {
  try {
    const response = await axios.post('/tickets', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el ticket:', error);
    throw error;
  }
};

// Actualizar un ticket existente
export const updateTicket = async (id: string, ticketData: Partial<ITicketFormData>): Promise<ITicket> => {
  try {
    const response = await axios.patch(`/tickets/${id}`, ticketData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el ticket ${id}:`, error);
    throw error;
  }
};

// Cambiar el estado de un ticket
export const updateTicketStatus = async (id: string, estado: 'abierto' | 'en_proceso' | 'cerrado'): Promise<ITicket> => {
  try {
    const response = await axios.patch(`/tickets/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar el estado del ticket ${id}:`, error);
    throw error;
  }
};

// Asignar un ticket a un usuario
export const assignTicket = async (id: string, usuarioId: string): Promise<ITicket> => {
  try {
    const response = await axios.patch(`/tickets/${id}/asignar`, { usuarioId });
    return response.data;
  } catch (error) {
    console.error(`Error al asignar el ticket ${id}:`, error);
    throw error;
  }
};

// Añadir un comentario a un ticket
export const addComment = async (ticketId: string, contenido: string): Promise<ITicket> => {
  try {
    const response = await axios.post(`/tickets/${ticketId}/comentarios`, { contenido });
    return response.data;
  } catch (error) {
    console.error(`Error al añadir un comentario al ticket ${ticketId}:`, error);
    throw error;
  }
};

// Eliminar un ticket
export const deleteTicket = async (id: string): Promise<void> => {
  try {
    await axios.delete(`/tickets/${id}`);
  } catch (error) {
    console.error(`Error al eliminar el ticket ${id}:`, error);
    throw error;
  }
};