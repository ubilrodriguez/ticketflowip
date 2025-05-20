import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Ticket, Home, LogOut, Users, BarChart2, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determinar ruta activa
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link to="/" className="flex items-center">
              <Ticket className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">TicketFlow</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <div className="relative">
              <Bell className="h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-900" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-white text-xs">
                3
              </span>
            </div>
            
            <div className="ml-4 flex items-center">
              <span className="hidden md:block text-sm font-medium text-gray-700 mr-2">
                {user?.nombre}
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <User className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside 
          className={`fixed inset-y-0 left-0 transform ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 transition duration-200 ease-in-out z-30 md:static md:inset-auto md:translate-x-0 
          w-64 bg-white shadow-md pt-16 md:pt-0 overflow-y-auto`}
        >
          <nav className="px-2 py-4 space-y-1">
            <Link
              to="/"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="mr-3 h-5 w-5" />
              Inicio
            </Link>
            
            <Link
              to="/tickets"
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                isActive('/tickets') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Ticket className="mr-3 h-5 w-5" />
              Tickets
            </Link>
            
            {hasRole(['administrador']) && (
              <>
                <Link
                  to="/admin"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  Panel Admin
                </Link>
                
                <Link
                  to="/admin/users"
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                    isActive('/admin/users') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Users className="mr-3 h-5 w-5" />
                  Usuarios
                </Link>
              </>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 w-full"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar Sesión
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-x-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;