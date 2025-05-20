import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RoleRouteProps {
  children: React.ReactNode;
  roles: string[];
}

const RoleRoute: React.FC<RoleRouteProps> = ({ children, roles }) => {
  const { hasRole, loading } = useAuth();

  // Mostrar spinner mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirigir a dashboard si no tiene el rol requerido
  if (!hasRole(roles)) {
    return <Navigate to="/" replace />;
  }

  // Renderizar los hijos (componentes protegidos) si tiene el rol requerido
  return <>{children}</>;
};

export default RoleRoute;