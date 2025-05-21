import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Unauthorized from './pages/Unauthorized';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
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
                </Route>
                
                {/* Rutas protegidas - requieren rol de administrador */}
                <Route element={<ProtectedRoute requiredRoles={['administrador']} />}>
                </Route>
                
                {/* Rutas protegidas - requieren rol de agente o administrador */}
                <Route element={<ProtectedRoute requiredRoles={['administrador', 'agente']} />}>
                </Route>
                
                {/* Ruta 404 - No encontrado */}
                <Route path="*" element={<div className="text-center py-20">Página no encontrada</div>} />
              </Routes>
            </main>
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;