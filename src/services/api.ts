import axios from 'axios';

// Configura la URL base a través de una variable que puede ser sobreescrita
// Usa un valor por defecto para desarrollo local
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_PATH = import.meta.env.VITE_API_PATH || '/api';

// Combina la URL base y la ruta de la API
const API_URL = `${BASE_URL}${API_PATH}`;

console.log('API configurada en:', API_URL);

// Instancia de axios con configuración personalizada
const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 segundos de timeout para detectar problemas de conexión más rápido
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Permite cookies para autenticación
});

// Interceptor para añadir token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Errores específicos de red
    if (!error.response) {
      console.error('Error de conexión:', error.message);
      // Puedes añadir un mecanismo de reintentos aquí si lo deseas
    } 
    // Manejo de errores específicos por código
    else if (error.response.status === 401) {
      console.error('Error de autenticación. Redirigiendo al login...');
      localStorage.removeItem('token');
      // Descomentar para redirigir automáticamente
      // window.location.href = '/auth/login';
    } 
    else if (error.response.status === 403) {
      console.error('No tiene permisos para esta acción');
    }
    
    return Promise.reject(error);
  }
);

// Exporta la instancia configurada
export default api;

// También exportamos la URL base para uso en otras partes de la aplicación
export { API_URL };