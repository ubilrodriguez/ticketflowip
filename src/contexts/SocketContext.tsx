import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket debe ser usado dentro de un SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Crear conexión Socket.IO
      const socketInstance = io('http://localhost:3000', {
        withCredentials: true,
      });

      // Manejar eventos de conexión
      socketInstance.on('connect', () => {
        console.log('Socket conectado');
        setConnected(true);
        socketInstance.emit('identity', user.id);
      });

      socketInstance.on('disconnect', () => {
        console.log('Socket desconectado');
        setConnected(false);
      });

      // Escuchar notificaciones
      socketInstance.on('notification', (notification) => {
        toast(notification.message, {
          icon: notification.type === 'success' ? '✅' : notification.type === 'error' ? '❌' : 'ℹ️',
        });
      });

      // Escuchar actualizaciones de tickets
      socketInstance.on('ticketUpdate', (update) => {
        console.log('Actualización de ticket recibida:', update);
        // Aquí puedes implementar la lógica para actualizar el estado de los tickets
      });

      // Escuchar nuevos comentarios
      socketInstance.on('newComment', (data) => {
        console.log('Nuevo comentario recibido:', data);
        // Aquí puedes implementar la lógica para actualizar los comentarios
      });

      setSocket(socketInstance);

      // Limpiar al desmontar
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};