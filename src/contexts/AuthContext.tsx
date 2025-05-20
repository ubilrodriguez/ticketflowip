import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Definir la URL base de la API actualizada al puerto correcto
const API_URL = 'http://localhost:3000/api';

interface User {
  id: string;
  nombre: string;
  email: string;
  rol: 'administrador' | 'agente' | 'cliente';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (nombre: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Configurar interceptor de Axios para incluir el token en todas las solicitudes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Verificar si el token es válido decodificándolo
          const decoded: any = jwtDecode(token);
          
          // Verificar si el token ha expirado
          if (decoded.exp * 1000 < Date.now()) {
            throw new Error('Token expirado');
          }
          
          // Obtener información del usuario desde el backend
          const response = await axios.get(`${API_URL}/auth/me`);
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);

// console.log('Detalles del error:', {
//   status: error.response?.status,
//   data: error.response?.data,
//   message: error.message
// });      
//       const response = await axios.post(`${API_URL}/auth/login`, {
//         email,
//         password
//       });
      
//       console.log('Respuesta del servidor:', response.data);
      
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       setToken(token);
//       setUser(user);
//       setIsAuthenticated(true);
//       toast.success('¡Inicio de sesión exitoso!');
//     } catch (error: any) {
//       console.error('Error de inicio de sesión:', error);
//       console.error('Detalles del error:', {
//         status: error.response?.status,
//         data: error.response?.data,
//         message: error.message
//       });
//       toast.error(error.response?.data?.message || 'Error al iniciar sesión');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };


const login = async (email: string, password: string) => {
  try {
    setLoading(true);
    
    // Eliminado el console.log problemático
    
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    console.log('Respuesta del servidor:', response.data);
    
    const { token, user } = response.data;
    
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    toast.success('¡Inicio de sesión exitoso!');
  } catch (error: any) {
    console.error('Error de inicio de sesión:', error);
    console.error('Detalles del error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    toast.error(error.response?.data?.message || 'Error al iniciar sesión');
    throw error;
  } finally {
    setLoading(false);
  }
};

  const register = async (nombre: string, email: string, password: string) => {
    try {
      setLoading(true);
      console.log('Intentando registro con:', { nombre, email, url: `${API_URL}/auth/register` });
      
      await axios.post(`${API_URL}/auth/register`, {
        nombre,
        email,
        password
      });
      
      toast.success('Registro exitoso. Por favor inicia sesión.');
    } catch (error: any) {
      console.error('Error de registro:', error);
      console.error('Detalles del error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      toast.error(error.response?.data?.message || 'Error al registrarse');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Sesión cerrada correctamente');
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.rol);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};