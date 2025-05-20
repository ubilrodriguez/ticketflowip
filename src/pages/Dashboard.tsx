import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Ticket, PlusCircle, Clock, CheckCircle2, AlertCircle, BarChart, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Componente para tarjetas de estadísticas
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              <div className="text-lg font-medium text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Componente para tickets recientes
const RecentTicket = ({ ticket, onClick }) => {
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div 
      className="bg-white p-4 rounded-lg shadow mb-3 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-900">{ticket.titulo}</h3>
          <p className="text-xs text-gray-500 mt-1">ID: {ticket.id}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.prioridad)}`}>
            {ticket.prioridad}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.estado)}`}>
            {ticket.estado === 'en_progreso' ? 'En progreso' : ticket.estado}
          </span>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Creado por: {ticket.cliente.nombre}</p>
        <p>Última actualización: {formatDate(ticket.actualizado)}</p>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ticketsTotal: 0,
    ticketsAbiertos: 0,
    ticketsEnProgreso: 0, 
    ticketsResueltos: 0
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo para propósitos de demostración
        setStats({
          ticketsTotal: 48,
          ticketsAbiertos: 12,
          ticketsEnProgreso: 18,
          ticketsResueltos: 18
        });

        setRecentTickets([
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
          }
        ]);
        
        setLoading(false);

        // En una implementación real, descomentar el siguiente código:
        /*
        // Obtener estadísticas
        const statsResponse = await axios.get('http://localhost:3000/api/dashboard/stats');
        
        // Obtener tickets recientes
        const ticketsResponse = await axios.get('http://localhost:3000/api/tickets/recientes');
        
        setStats(statsResponse.data);
        setRecentTickets(ticketsResponse.data);
        */
      } catch (error) {
        console.error('Error al cargar los datos del dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Hola, {user?.nombre} 👋
        </h1>
        <button
          onClick={() => navigate('/tickets/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Ticket
        </button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Tickets" 
          value={stats.ticketsTotal} 
          icon={<Ticket className="h-6 w-6 text-white" />} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Tickets Abiertos" 
          value={stats.ticketsAbiertos} 
          icon={<Clock className="h-6 w-6 text-white" />} 
          color="bg-yellow-500" 
        />
        <StatCard 
          title="En Progreso" 
          value={stats.ticketsEnProgreso} 
          icon={<AlertCircle className="h-6 w-6 text-white" />} 
          color="bg-orange-500" 
        />
        <StatCard 
          title="Resueltos" 
          value={stats.ticketsResueltos} 
          icon={<CheckCircle2 className="h-6 w-6 text-white" />} 
          color="bg-green-500" 
        />
      </div>

      {/* Panel principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets recientes */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Tickets Recientes</h2>
            <button 
              onClick={() => navigate('/tickets')}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Ver todos
            </button>
          </div>
          
          {recentTickets.length > 0 ? (
            <div className="space-y-4">
              {recentTickets.map((ticket) => (
                <RecentTicket 
                  key={ticket.id} 
                  ticket={ticket} 
                  onClick={() => navigate(`/tickets/${ticket.id}`)} 
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No hay tickets recientes</p>
          )}
        </div>

        {/* Panel de información rápida */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Panel de información</h2>
          
          {hasRole(['administrador']) && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <BarChart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Rendimiento del equipo</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Tiempo promedio de resolución: 18h</p>
                      <p>Tasa de satisfacción: 92%</p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate('/admin')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Ver métricas detalladas
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-purple-800">Gestión de equipo</h3>
                    <div className="mt-2 text-sm text-purple-700">
                      <p>5 agentes activos</p>
                      <p>2 agentes con alta carga</p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate('/admin/users')}
                        className="text-sm font-medium text-purple-600 hover:text-purple-500"
                      >
                        Administrar usuarios
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasRole(['agente']) && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Tus tickets asignados</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Tickets activos: 8</p>
                      <p>Tickets de alta prioridad: 3</p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate('/tickets')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Ver tus tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {hasRole(['cliente']) && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Ticket className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Estado de tus tickets</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>Tickets activos: 3</p>
                      <p>Tickets resueltos: 5</p>
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => navigate('/tickets')}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Ver tus tickets
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Información de contacto - para todos los roles */}
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900">Soporte</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>Para obtener ayuda, contacta con:</p>
              <p className="mt-1">soporte@ticketflow.com</p>
              <p>+34 900 123 456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;