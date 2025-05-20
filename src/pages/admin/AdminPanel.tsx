import React, { useState, useEffect } from 'react';
import { BarChart2, Clock, CheckCircle2, Users, AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Importaciones para gráficos
// Nota: En una implementación real, usar Chart.js y react-chartjs-2
// import { Chart, registerables } from 'chart.js';
// import { Bar, Line, Doughnut } from 'react-chartjs-2';
// Chart.register(...registerables);

const AdminPanel: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    ticketsTotal: 48,
    ticketsAbiertos: 12,
    ticketsEnProgreso: 18,
    ticketsResueltos: 18,
    tiempoPromedioResolucion: '18 horas',
    tasaSatisfaccion: '92%',
    ticketsNuevosSemana: 12,
    ticketsResueltosSemanaa: 14
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo para propósitos de demostración
        // En una implementación real, descomentar:
        /*
        const statsResponse = await axios.get(`http://localhost:3000/api/admin/stats?timeRange=${timeRange}`);
        setStats(statsResponse.data);
        */
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos administrativos:', error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [timeRange]);

  // Comprobar permisos de administrador
  useEffect(() => {
    if (!hasRole(['administrador'])) {
      navigate('/');
    }
  }, [hasRole, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Datos de gráficos (simulados para la demostración)
  const ticketsByDayData = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    new: [4, 3, 5, 2, 7, 1, 2],
    resolved: [2, 4, 6, 3, 5, 2, 3]
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Panel de administración</h1>
        
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-4 py-2 text-sm font-medium border ${
              timeRange === '7d' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-l-md`}
          >
            7 días
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-4 py-2 text-sm font-medium border-t border-b ${
              timeRange === '30d' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            30 días
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-4 py-2 text-sm font-medium border ${
              timeRange === '90d' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            } rounded-r-md`}
          >
            90 días
          </button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <BarChart2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.ticketsTotal}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Aumentado por</span>
                      8%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tiempo Promedio de Resolución</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.tiempoPromedioResolucion}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowDown className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Disminuido por</span>
                      5%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tasa de Satisfacción</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stats.tasaSatisfaccion}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <ArrowUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                      <span className="sr-only">Aumentado por</span>
                      3%
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Agentes Activos</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">5</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-gray-600">
                      de 6 totales
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Métricas */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Gráfico de tickets por día */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Tickets por día</h3>
            <div className="mt-2">
              <div className="h-64 bg-gray-50 rounded-md p-4 relative">
                {/* En una implementación real, aquí iría un componente de gráfico */}
                {/* <Bar data={...} options={...} /> */}
                
                {/* Simulación visual del gráfico para la demostración */}
                <div className="absolute inset-0 p-6 flex items-end">
                  {ticketsByDayData.labels.map((day, index) => (
                    <div key={day} className="flex flex-col items-center mx-2 flex-1">
                      <div className="relative w-full">
                        <div 
                          className="bg-green-500 rounded-t"
                          style={{ 
                            height: `${ticketsByDayData.resolved[index] * 12}px`,
                            width: '100%' 
                          }}
                        ></div>
                        <div 
                          className="absolute bottom-0 left-0 bg-blue-500 rounded-t"
                          style={{ 
                            height: `${ticketsByDayData.new[index] * 12}px`,
                            width: '100%',
                            transform: 'translateY(100%)' 
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 mt-2">{day}</span>
                    </div>
                  ))}
                </div>
                
                <div className="absolute top-2 right-2 flex space-x-4">
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                    <span className="ml-1 text-xs text-gray-600">Nuevos</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                    <span className="ml-1 text-xs text-gray-600">Resueltos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Distribución de tickets por estado */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Distribución por estado</h3>
            <div className="mt-2">
              <div className="h-64 bg-gray-50 rounded-md p-4 flex justify-center items-center">
                {/* En una implementación real, aquí iría un componente de gráfico */}
                {/* <Doughnut data={...} options={...} /> */}
                
                {/* Simulación visual del gráfico para la demostración */}
                <div className="w-40 h-40 rounded-full border-8 border-transparent relative">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div className="absolute inset-0" style={{ 
                      clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 0 0, 0 50%)',
                      backgroundColor: '#3B82F6'
                    }}></div>
                    <div className="absolute inset-0" style={{ 
                      clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 100% 100%, 100% 50%)',
                      backgroundColor: '#F59E0B'
                    }}></div>
                    <div className="absolute inset-0" style={{ 
                      clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 75% 100%)',
                      backgroundColor: '#10B981'
                    }}></div>
                  </div>
                </div>
                
                <div className="ml-8 space-y-3">
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-blue-500 rounded-full"></span>
                    <span className="ml-2 text-sm text-gray-600">Abiertos (25%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-yellow-500 rounded-full"></span>
                    <span className="ml-2 text-sm text-gray-600">En Progreso (40%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                    <span className="ml-2 text-sm text-gray-600">Resueltos (35%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Alertas y notificaciones
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Información importante que requiere atención.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-yellow-50 p-4 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Dos agentes tienen alta carga de trabajo (más de 10 tickets activos).
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  3 tickets de alta prioridad llevan más de 24 horas sin respuesta.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 border-t border-gray-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  El tiempo de respuesta promedio ha mejorado un 15% esta semana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas por Agente */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Métricas por agente
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Rendimiento de cada agente durante el período seleccionado.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets asignados
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resueltos
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiempo promedio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satisfacción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-medium">CL</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Carlos López</div>
                      <div className="text-sm text-gray-500">Agente Senior</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">14</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">12</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">16 horas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">95%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-medium">LM</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Laura Martínez</div>
                      <div className="text-sm text-gray-500">Agente Junior</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">9</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">7</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">22 horas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">88%</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium">MR</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">Miguel Rodríguez</div>
                      <div className="text-sm text-gray-500">Agente Senior</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">16</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">14</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">18 horas</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">92%</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;