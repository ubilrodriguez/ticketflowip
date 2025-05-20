import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, PlusCircle, ChevronDown, Search, Filter, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    estado: 'todos',
    prioridad: 'todas',
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo para propósitos de demostración
        const mockTickets = [
          {
            id: "TK-1001",
            titulo: "Error al iniciar sesión en la aplicación móvil",
            descripcion: "No puedo acceder a mi cuenta desde la aplicación móvil.",
            prioridad: "Alta",
            estado: "abierto",
            cliente: { id: "1", nombre: "Juan Pérez" },
            actualizado: "2025-04-10T14:30:00",
            creado: "2025-04-10T10:15:00",
            asignado: null
          },
          {
            id: "TK-1002",
            titulo: "Problema con la exportación de informes",
            descripcion: "Al intentar exportar informes en PDF, el sistema muestra un error.",
            prioridad: "Media",
            estado: "en_progreso",
            cliente: { id: "2", nombre: "María García" },
            actualizado: "2025-04-09T16:45:00",
            creado: "2025-04-09T11:20:00",
            asignado: { id: "5", nombre: "Carlos López" }
          },
          {
            id: "TK-1003",
            titulo: "Solicitud de nueva funcionalidad: Filtros avanzados",
            descripcion: "Necesitamos implementar filtros más avanzados en la sección de reportes.",
            prioridad: "Baja",
            estado: "en_progreso",
            cliente: { id: "3", nombre: "Ana Rodríguez" },
            actualizado: "2025-04-08T09:30:00",
            creado: "2025-04-07T14:50:00",
            asignado: { id: "6", nombre: "Laura Martínez" }
          },
          {
            id: "TK-1004",
            titulo: "Error en la integración con API externa",
            descripcion: "La sincronización con el sistema externo falla intermitentemente.",
            prioridad: "Alta",
            estado: "resuelto",
            cliente: { id: "4", nombre: "Roberto Díaz" },
            actualizado: "2025-04-06T17:15:00",
            creado: "2025-04-05T10:10:00",
            asignado: { id: "5", nombre: "Carlos López" }
          },
          {
            id: "TK-1005",
            titulo: "Problemas de rendimiento en dashboard",
            descripcion: "El dashboard se carga muy lentamente cuando hay muchos datos.",
            prioridad: "Media",
            estado: "abierto",
            cliente: { id: "2", nombre: "María García" },
            actualizado: "2025-04-04T11:20:00",
            creado: "2025-04-04T09:30:00",
            asignado: null
          },
          {
            id: "TK-1006",
            titulo: "Actualización de la documentación de API",
            descripcion: "Es necesario actualizar la documentación con los nuevos endpoints.",
            prioridad: "Baja",
            estado: "cerrado",
            cliente: { id: "3", nombre: "Ana Rodríguez" },
            actualizado: "2025-04-02T15:45:00",
            creado: "2025-04-01T10:20:00",
            asignado: { id: "6", nombre: "Laura Martínez" }
          }
        ];
        
        setTickets(mockTickets);
        setLoading(false);

        // En una implementación real, descomentar el siguiente código:
        /*
        const response = await axios.get('http://localhost:3000/api/tickets');
        setTickets(response.data);
        */
      } catch (error) {
        console.error('Error al cargar tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filtrar tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = filters.estado === 'todos' || ticket.estado === filters.estado;
    const matchesPrioridad = filters.prioridad === 'todas' || ticket.prioridad.toLowerCase() === filters.prioridad.toLowerCase();
    
    return matchesSearch && matchesEstado && matchesPrioridad;
  });

  // Función para aplicar filtros
  const applyFilters = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    setFilters({
      estado: formData.get('estado') as string,
      prioridad: formData.get('prioridad') as string,
    });
    
    setShowFilters(false);
  };

  // Función para limpiar filtros
  const clearFilters = () => {
    setFilters({
      estado: 'todos',
      prioridad: 'todas',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'alta': return 'text-red-600 bg-red-100';
      case 'media': return 'text-yellow-600 bg-yellow-100';
      case 'baja': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'abierto': return 'text-blue-600 bg-blue-100';
      case 'en_progreso': return 'text-yellow-600 bg-yellow-100';
      case 'resuelto': return 'text-green-600 bg-green-100';
      case 'cerrado': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Tickets</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por título o ID..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              Filtros
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            
            <button
              onClick={() => navigate('/tickets/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nuevo Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Filtros</h3>
            <button 
              onClick={() => setShowFilters(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  defaultValue={filters.estado}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="todos">Todos</option>
                  <option value="abierto">Abierto</option>
                  <option value="en_progreso">En progreso</option>
                  <option value="resuelto">Resuelto</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700">
                  Prioridad
                </label>
                <select
                  id="prioridad"
                  name="prioridad"
                  defaultValue={filters.prioridad}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="todas">Todas</option>
                  <option value="alta">Alta</option>
                  <option value="media">Media</option>
                  <option value="baja">Baja</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aplicar filtros
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de tickets */}
      {filteredTickets.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTickets.map((ticket) => (
              <li key={ticket.id}>
                <div 
                  className="block hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                  onClick={() => navigate(`/tickets/${ticket.id}`)}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Ticket className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {ticket.titulo}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(ticket.prioridad)}`}>
                          {ticket.prioridad}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="truncate">
                            Por: {ticket.cliente.nombre}
                          </span>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(ticket.estado)}`}>
                            {ticket.estado === 'en_progreso' ? 'En progreso' : ticket.estado}
                          </span>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          <span>
                            Creado el: {formatDate(ticket.creado)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md p-8 text-center">
          <Ticket className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron tickets</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filters.estado !== 'todos' || filters.prioridad !== 'todas'
              ? 'Intenta con diferentes términos de búsqueda o filtros'
              : 'Crea tu primer ticket para comenzar'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate('/tickets/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear Ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketList;