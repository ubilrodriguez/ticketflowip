import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Componentes de layout
import Header from './components/Header';

import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/Unauthorized';

// Componentes de páginas protegidas
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// Importa otros componentes de páginas según sea necesario
// import TicketList from './pages/tickets/TicketList';
// import TicketForm from './pages/tickets/TicketForm';
// import AdminDashboard from './pages/admin/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Rutas protegidas - requieren autenticación */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/tickets" element={<TicketList />} /> */}
                {/* <Route path="/tickets/new" element={<TicketForm />} /> */}
                {/* <Route path="/tickets/:id" element={<TicketDetail />} /> */}
              </Route>
              
              {/* Rutas protegidas - requieren rol de administrador */}
              <Route element={<ProtectedRoute requiredRoles={['administrador']} />}>
                {/* <Route path="/admin" element={<AdminDashboard />} /> */}
                {/* <Route path="/admin/users" element={<UserManagement />} /> */}
              </Route>
              
              {/* Rutas protegidas - requieren rol de agente o administrador */}
              <Route element={<ProtectedRoute requiredRoles={['administrador', 'agente']} />}>
                {/* <Route path="/tickets/manage" element={<ManageTickets />} /> */}
              </Route>
              
              {/* Ruta 404 - No encontrado */}
              <Route path="*" element={<div className="text-center py-20">Página no encontrada</div>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;