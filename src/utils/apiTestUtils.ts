// Archivo para testear la conectividad con la API
import { API_URL } from '../services/api';

/**
 * Función para verificar la conectividad al backend
 * @returns {Promise<boolean>} true si la conexión es exitosa, false en caso contrario
 */
export const testApiConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  try {
    // Hacemos un fetch simple a la raíz de la API o un endpoint de health
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // No incluimos credenciales para un simple test de disponibilidad
      mode: 'cors',
      // Timeout corto para no bloquear la UI
      signal: AbortSignal.timeout(5000) // 5 segundos de timeout
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Conexión exitosa al servidor API'
      };
    }
    
    return {
      success: false,
      message: `El servidor respondió con estado: ${response.status}`,
      details: await response.text()
    };
  } catch (error) {
    // Manejamos diferentes tipos de errores para diagnóstico
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: `No se pudo conectar a ${API_URL}. Verifica que el servidor esté en ejecución.`,
        details: error
      };
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        success: false,
        message: 'La conexión al servidor excedió el tiempo de espera.',
        details: error
      };
    }
    
    return {
      success: false,
      message: 'Error al conectar con el servidor API',
      details: error
    };
  }
};

/**
 * Componente de diagnóstico para mostrar en desarrollo
 */
export const ApiDiagnostic = () => {
  return {
    apiUrl: API_URL,
    browserInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
    },
    runTest: testApiConnection
  };
};