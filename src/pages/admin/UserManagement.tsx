import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { PlusCircle, Search, Edit, Trash, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'agente' | 'cliente';
  activo: boolean;
  creado: string;
}

const UserManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Comprobar permisos de administrador
  useEffect(() => {
    if (!hasRole(['administrador'])) {
      navigate('/');
    }
  }, [hasRole, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo para propósitos de demostración
        const mockUsers = [
          {
            id: "1",
            nombre: "Juan Pérez",
            email: "juan@ejemplo.com",
            rol: "cliente",
            activo: true,
            creado: "2025-01-15T10:30:00"
          },
          {
            id: "2",
            nombre: "María García",
            email: "maria@ejemplo.com",
            rol: "cliente",
            activo: true,
            creado: "2025-01-20T14:45:00"
          },
          {
            id: "3",
            nombre: "Ana Rodríguez",
            email: "ana@ejemplo.com",
            rol: "cliente",
            activo: false,
            creado: "2025-02-05T09:15:00"
          },
          {
            id: "4",
            nombre: "Roberto Díaz",
            email: "roberto@ejemplo.com",
            rol: "cliente",
            activo: true,
            creado: "2025-02-10T16:20:00"
          },
          {
            id: "5",
            nombre: "Carlos López",
            email: "carlos@ejemplo.com",
            rol: "agente",
            activo: true,
            creado: "2024-12-10T08:30:00"
          },
          {
            id: "6",
            nombre: "Laura Martínez",
            email: "laura@ejemplo.com",
            rol: "agente",
            activo: true,
            creado: "2025-01-05T11:45:00"
          },
          {
            id: "7",
            nombre: "Miguel Rodríguez",
            email: "miguel@ejemplo.com",
            rol: "agente",
            activo: true,
            creado: "2024-11-15T13:10:00"
          },
          {
            id: "8",
            nombre: "Sofía Fernández",
            email: "sofia@ejemplo.com",
            rol: "administrador",
            activo: true,
            creado: "2024-10-20T09:00:00"
          }
        ];
        
        setUsers(mockUsers as User[]);
        setLoading(false);

        // En una implementación real, descomentar el siguiente código:
        /*
        const response = await axios.get('http://localhost:3000/api/admin/users');
        setUsers(response.data);
        */
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    return (
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.rol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEditing && selectedUser) {
        // En una implementación real, enviar la actualización al backend
        /*
        await axios.put(`http://localhost:3000/api/admin/users/${selectedUser.id}`, {
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          activo: data.activo
        });
        */
        
        // Actualizar usuario localmente para demostración
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, nombre: data.nombre, email: data.email, rol: data.rol, activo: data.activo === 'true' } 
            : user
        ));
        
        toast.success(`Usuario ${data.nombre} actualizado correctamente`);
      } else {
        // En una implementación real, crear nuevo usuario en el backend
        /*
        const response = await axios.post('http://localhost:3000/api/admin/users', {
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          password: data.password
        });
        const newUser = response.data;
        */
        
        // Crear usuario localmente para demostración
        const newUser = {
          id: Date.now().toString(),
          nombre: data.nombre,
          email: data.email,
          rol: data.rol,
          activo: true,
          creado: new Date().toISOString()
        };
        
        setUsers([...users, newUser]);
        toast.success(`Usuario ${data.nombre} creado correctamente`);
      }
      
      closeModal();
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      toast.error('Error al guardar usuario');
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    reset({
      nombre: user.nombre,
      email: user.email,
      rol: user.rol,
      activo: user.activo.toString()
    });
    setShowModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        // En una implementación real, eliminar usuario en el backend
        /*
        await axios.delete(`http://localhost:3000/api/admin/users/${userId}`);
        */
        
        // Eliminar usuario localmente para demostración
        setUsers(users.filter(user => user.id !== userId));
        toast.success('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        toast.error('Error al eliminar usuario');
      }
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    reset({
      nombre: '',
      email: '',
      rol: 'cliente',
      password: '',
      confirmPassword: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    reset();
  };

  const formatDate = (dateString: string) => {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Gestión de Usuarios</h1>
        
        <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creado
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      {user.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.nombre}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.rol === 'administrador' 
                      ? 'bg-purple-100 text-purple-800' 
                      : user.rol === 'agente' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.rol}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.creado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para crear/editar usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Editar usuario' : 'Crear nuevo usuario'}
              </h3>
              <button onClick={closeModal}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className={`mt-1 block w-full rounded-md ${
                    errors.nombre ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  {...register('nombre', { required: 'El nombre es obligatorio' })}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`mt-1 block w-full rounded-md ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  {...register('email', { 
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Dirección de email inválida'
                    }
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                  Rol
                </label>
                <select
                  id="rol"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  {...register('rol', { required: 'El rol es obligatorio' })}
                >
                  <option value="cliente">Cliente</option>
                  <option value="agente">Agente</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              {isEditing && (
                <div>
                  <label htmlFor="activo" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="activo"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    {...register('activo')}
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              )}

              {!isEditing && (
                <>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      id="password"
                      className={`mt-1 block w-full rounded-md ${
                        errors.password ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('password', { 
                        required: 'La contraseña es obligatoria',
                        minLength: {
                          value: 6,
                          message: 'La contraseña debe tener al menos 6 caracteres'
                        }
                      })}
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirmar contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={`mt-1 block w-full rounded-md ${
                        errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                      {...register('confirmPassword', { 
                        required: 'Confirma la contraseña',
                        validate: (value, formValues) => 
                          value === formValues.password || 'Las contraseñas no coinciden'
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="mr-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Guardar cambios' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;