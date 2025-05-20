import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    email: string;
    rol: 'administrador' | 'agente' | 'cliente';
  };
}

const authService = {
  // Login de usuario
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Registro de usuario
  register: async (userData: RegisterData): Promise<void> => {
    await api.post('/auth/register', userData);
  },

  // Obtener perfil del usuario actual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Cerrar sesión (si el backend requiere una llamada para invalidar el token)
  logout: async (): Promise<void> => {
    try {
      // Llamar al endpoint de logout si existe
      // await api.post('/auth/logout');
      
      // Limpieza local
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Asegurar que el token se elimine incluso si hay un error
      localStorage.removeItem('token');
    }
  },
};

export default authService;