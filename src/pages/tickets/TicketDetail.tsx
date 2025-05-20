import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, Clock, AlertCircle, CheckCircle2, Edit, User, MessageSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface Comment {
  id: string;
  usuario: {
    id: string;
    nombre: string;
    rol: string;
  };
  mensaje: string;
  creado: string;
  esInterno: boolean;
}

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isInternalComment, setIsInternalComment] = useState(false);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: editErrors, isSubmitting: isEditSubmitting } } = useForm();

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo para propósitos de demostración
        const mockTicket = {
          id: "TK-1001",
          titulo: "Error al iniciar sesión en la aplicación móvil",
          descripcion: "No puedo acceder a mi cuenta desde la aplicación móvil. He intentado restablecer mi contraseña pero sigo sin poder iniciar sesión. Estoy usando la versión más reciente de la aplicación en un iPhone 12.",
          prioridad: "Alta",
          estado: "abierto",
          cliente: { id: "1", nombre: "Juan Pérez", rol: "cliente" },
          asignado: null,
          actualizado: "2025-04-10T14:30:00",
          creado: "2025-04-10T10:15:00",
          categoria: "Aplicación Móvil"
        };

        const mockComments = [
          {
            id: "1",
            usuario: { id: "1", nombre: "Juan Pérez", rol: "cliente" },
            mensaje: "También he intentado reinstalar la aplicación pero sigue sin funcionar.",
            creado: "2025-04-10T11:20:00",
            esInterno: false
          },
          {
            id: "2",
            usuario: { id: "5", nombre: "Carlos López", rol: "agente" },
            mensaje: "Hola Juan, ¿podrías indicarnos qué versión exacta de la aplicación estás utilizando?",
            creado: "2025-04-10T12:45:00",
            esInterno: false
          },
          {
            id: "3",
            usuario: { id: "5", nombre: "Carlos López", rol: "agente" },
            mensaje: "Parece ser un problema con la última actualización. Estoy asignando esto al equipo de desarrollo.",
            creado: "2025-04-10T12:50:00",
            esInterno: true
          },
          {
            id: "4",
            usuario: { id: "1", nombre: "Juan Pérez", rol: "cliente" },
            mensaje: "Estoy usando la versión 2.3.4 de la aplicación.",
            creado: "2025-04-10T13:15:00",
            esInterno: false
          }
        ];
        
        setTicket(mockTicket);
        setComments(mockComments);
        setLoading(false);

        // En una implementación real, descomentar el siguiente código:
        /*
        const ticketResponse = await axios.get(`http://localhost:3000/api/tickets/${id}`);
        const commentsResponse = await axios.get(`http://localhost:3000/api/tickets/${id}/comments`);
        
        setTicket(ticketResponse.data);
        setComments(commentsResponse.data);
        */
      } catch (error) {
        console.error('Error al cargar los datos del ticket:', error);
        toast.error('Error al cargar los datos del ticket');
        setLoading(false);
      }
    };

    if (id) {
      fetchTicketData();
    }
  }, [id]);

  // Desplazamiento automático al final de los comentarios
  useEffect(() => {
    if (commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments]);

  const onSubmitComment = async (data: any) => {
    try {
      // En una implementación real, enviar el comentario al backend
      /*
      await axios.post(`http://localhost:3000/api/tickets/${id}/comments`, {
        mensaje: data.comentario,
        esInterno: isInternalComment
      });
      */
      
      // Para demostración, agregar el comentario localmente
      const newComment = {
        id: Date.now().toString(),
        usuario: { 
          id: user?.id || 'temp-id', 
          nombre: user?.nombre || 'Usuario actual',
          rol: user?.rol || 'agente'
        },
        mensaje: data.comentario,
        creado: new Date().toISOString(),
        esInterno: isInternalComment
      };
      
      setComments([...comments, newComment]);
      toast.success('Comentario añadido correctamente');
      reset(); // Limpiar el formulario
      setIsInternalComment(false);
    } catch (error) {
      console.error('Error al enviar comentario:', error);
      toast.error('Error al enviar el comentario');
    }
  };

  const onSubmitEdit = async (data: any) => {
    try {
      // En una implementación real, actualizar el ticket en el backend
      /*
      await axios.put(`http://localhost:3000/api/tickets/${id}`, {
        estado: data.estado,
        prioridad: data.prioridad,
        asignado: data.asignado
      });
      */
      
      // Para demostración, actualizar el ticket localmente
      setTicket({
        ...ticket,
        estado: data.estado,
        prioridad: data.prioridad,
        asignado: data.asignado ? { id: 'temp-id', nombre: data.asignado } : ticket.asignado
      });
      
      toast.success('Ticket actualizado correctamente');
      setShowEditForm(false);
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      toast.error('Error al actualizar el ticket');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto': return 'text-blue-600 bg-blue-100';
      case 'en_progreso': return 'text-yellow-600 bg-yellow-100';
      case 'resuelto': return 'text-green-600 bg-green-100';
      case 'cerrado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'abierto': return <Clock className="h-5 w-5" />;
      case 'en_progreso': return <AlertCircle className="h-5 w-5" />;
      case 'resuelto': return <CheckCircle2 className="h-5 w-5" />;
      case 'cerrado': return <CheckCircle2 className="h-5 w-5" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-gray-900">Ticket no encontrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          El ticket que estás buscando no existe o no tienes permisos para verlo.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/tickets')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Volver a tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/tickets')}
          className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Volver
        </button>
        <h1 className="text-2xl font-bold text-gray-900 truncate">
          {ticket.id}: {ticket.titulo}
        </h1>
      </div>

      {/* Detalles y Comentarios (2 columnas en desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detalles del ticket */}
        <div className="lg:col-span-1 space-y-6">
          {/* Información principal */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Detalles del ticket
              </h3>
              {(hasRole(['administrador', 'agente'])) && (
                <button
                  onClick={() => setShowEditForm(!showEditForm)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Edit className="mr-1 h-4 w-4" />
                  Editar
                </button>
              )}
            </div>
            
            {showEditForm ? (
              <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <form onSubmit={handleSubmitEdit(onSubmitEdit)}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                        Estado
                      </label>
                      <select
                        id="estado"
                        defaultValue={ticket.estado}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        {...registerEdit('estado', { required: 'El estado es obligatorio' })}
                      >
                        <option value="abierto">Abierto</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="resuelto">Resuelto</option>
                        <option value="cerrado">Cerrado</option>
                      </select>
                      {editErrors.estado && (
                        <p className="mt-1 text-sm text-red-600">{editErrors.estado.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                        Prioridad
                      </label>
                      <select
                        id="prioridad"
                        defaultValue={ticket.prioridad}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        {...registerEdit('prioridad', { required: 'La prioridad es obligatoria' })}
                      >
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                      </select>
                      {editErrors.prioridad && (
                        <p className="mt-1 text-sm text-red-600">{editErrors.prioridad.message}</p>
                      )}
                    </div>
                    
                    {hasRole(['administrador']) && (
                      <div>
                        <label htmlFor="asignado" className="block text-sm font-medium text-gray-700">
                          Asignar a
                        </label>
                        <input
                          type="text"
                          id="asignado"
                          defaultValue={ticket.asignado?.nombre || ''}
                          placeholder="Nombre del agente"
                          className="mt-1 block w-full pl-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          {...registerEdit('asignado')}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Deja en blanco para desasignar.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex space-x-3 justify-end">
                      <button
                        type="button"
                        onClick={() => setShowEditForm(false)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isEditSubmitting}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {isEditSubmitting ? 'Guardando...' : 'Guardar cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Estado</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.estado)}`}>
                        {getStatusIcon(ticket.estado)}
                        <span className="ml-1">
                          {ticket.estado === 'en_progreso' ? 'En progreso' : ticket.estado}
                        </span>
                      </span>
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Prioridad</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.prioridad)}`}>
                        {ticket.prioridad}
                      </span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Categoría</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {ticket.categoria}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Cliente</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {ticket.cliente.nombre}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Asignado a</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {ticket.asignado ? ticket.asignado.nombre : 'No asignado'}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Creado</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(ticket.creado)}
                    </dd>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Actualizado</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {formatDate(ticket.actualizado)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
          
          {/* Descripción del ticket */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Descripción
              </h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {ticket.descripcion}
              </p>
            </div>
          </div>
        </div>

        {/* Comentarios */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow sm:rounded-lg flex flex-col h-full">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Comentarios
              </h3>
            </div>
            
            {/* Lista de comentarios */}
            <div className="flex-grow overflow-y-auto p-4" style={{ maxHeight: '500px' }}>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => {
                    // Determinar si el comentario es del usuario actual
                    const isCurrentUser = comment.usuario.id === user?.id;
                    // Solo mostrar comentarios internos a administradores y agentes
                    if (comment.esInterno && !hasRole(['administrador', 'agente'])) {
                      return null;
                    }
                    
                    return (
                      <div 
                        key={comment.id} 
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-lg rounded-lg p-3 ${
                          comment.esInterno 
                            ? 'bg-purple-50 border border-purple-100' 
                            : isCurrentUser 
                              ? 'bg-blue-50 border border-blue-100' 
                              : 'bg-gray-50 border border-gray-100'
                        }`}>
                          <div className="flex items-center">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              comment.esInterno 
                                ? 'bg-purple-100 text-purple-500'
                                : comment.usuario.rol === 'agente' || comment.usuario.rol === 'administrador'
                                  ? 'bg-blue-100 text-blue-500'
                                  : 'bg-gray-100 text-gray-500'
                            }`}>
                              <User className="h-5 w-5" />
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">
                                {comment.usuario.nombre}
                                {comment.esInterno && (
                                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    Interno
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formatDate(comment.creado)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-gray-800 whitespace-pre-wrap">
                              {comment.mensaje}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={commentsEndRef} />
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay comentarios</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Sé el primero en añadir un comentario a este ticket.
                  </p>
                </div>
              )}
            </div>

            {/* Formulario para añadir comentario */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSubmit(onSubmitComment)}>
                {hasRole(['administrador', 'agente']) && (
                  <div className="mb-3">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        checked={isInternalComment}
                        onChange={(e) => setIsInternalComment(e.target.checked)}
                      />
                      <span className="ml-2 text-sm text-gray-600">Comentario interno (solo visible para el equipo)</span>
                    </label>
                  </div>
                )}
                
                <div className="relative">
                  <textarea
                    id="comentario"
                    rows={3}
                    className={`block w-full border ${
                      errors.comentario ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Escribe tu comentario aquí..."
                    {...register('comentario', {
                      required: 'El comentario no puede estar vacío'
                    })}
                  ></textarea>
                  
                  {errors.comentario && (
                    <p className="mt-1 text-sm text-red-600">{errors.comentario.message}</p>
                  )}
                  
                  <div className="absolute right-2 bottom-2">
                    <button
                      type="button"
                      className="inline-flex items-center p-1 border border-transparent rounded-full shadow-sm text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Paperclip className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar comentario
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;