import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShieldX className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Acceso Denegado
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <p className="mb-4">
            Tu rol actu
            al no tiene acceso a esta sección. Si crees que deberías tener acceso, 
            contacta al administrador del sistema.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;