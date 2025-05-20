import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import Card from '../components/ui/Card';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
// import { ITicket } from '../interfac/ticket';
import { ITicket } from '../interfaces/ticket';
import { getAllTickets } from '../services/ticketService';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [recentTickets, setRecentTickets] = useState<ITicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentTickets = async () => {
      try {
        setIsLoading(true);
        // Si el usuario está autenticado, obtener tickets recientes
        if (isAuthenticated) {
          const tickets = await getAllTickets({ limit: 5, sort: 'createdAt:desc' });
          setRecentTickets(tickets);
        }
        setError(null);
      } catch (err) {
        setError('Error al cargar los tickets recientes');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTickets();
  }, [isAuthenticated]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Sistema de Gestión de Tickets</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Plataforma centralizada para la gestión y seguimiento de tickets de soporte
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="bg-blue-50 rounded-lg p-8 text-center shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Bienvenido a nuestro sistema</h2>
            <p className="mb-6">
              Inicia sesión o regístrate para empezar a gestionar tus tickets de soporte.
            </p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => navigate('/auth/login')}>
                Iniciar Sesión
              </Button>
              <Button variant="outline" onClick={() => navigate('/auth/register')}>
                Registrarse
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 shadow-md">
            <h2 className="text-2xl font-semibold mb-4">
              Bienvenido, {user?.nombre || 'Usuario'}
            </h2>
            <p className="mb-6">
              ¿Qué deseas hacer hoy?
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Button onClick={() => navigate('/tickets/create')}>
                Crear Nuevo Ticket
              </Button>
              <Button variant="secondary" onClick={() => navigate('/tickets')}>
                Ver Mis Tickets
              </Button>
              {user?.role === 'admin' && (
                <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
                  Panel de Administración
                </Button>
              )}
              <Button variant="outline" onClick={() => navigate('/profile')}>
                Mi Perfil
              </Button>
            </div>
          </div>
        )}
      </section>

      {isAuthenticated && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tickets Recientes</h2>
          {isLoading ? (
            <p className="text-center py-4">Cargando tickets recientes...</p>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
              {error}
            </div>
          ) : recentTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentTickets.map((ticket) => (
                <Card key={ticket.id} className="cursor-pointer hover:shadow-lg transition-shadow" 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg truncate">{ticket.titulo}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        ticket.estado === 'abierto' ? 'bg-green-100 text-green-800' :
                        ticket.estado === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ticket.estado === 'abierto' ? 'Abierto' :
                         ticket.estado === 'en_proceso' ? 'En Proceso' : 'Cerrado'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ticket.descripcion}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>ID: {ticket.id.substring(0, 8)}</span>
                      <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center py-4 text-gray-500">
              No hay tickets recientes para mostrar.
            </p>
          )}
          {recentTickets.length > 0 && (
            <div className="mt-4 text-center">
              <Button variant="text" onClick={() => navigate('/tickets')}>
                Ver todos los tickets
              </Button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default Home;