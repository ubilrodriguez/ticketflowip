import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
  }
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('EventsGateway');
  private users: Map<string, string> = new Map(); // userId -> socketId

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
    // Eliminar usuario desconectado
    for (const [userId, socketId] of this.users.entries()) {
      if (socketId === client.id) {
        this.users.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('identity')
  handleIdentity(client: Socket, userId: string) {
    this.users.set(userId, client.id);
    this.logger.log(`Usuario ${userId} identificado con socket ${client.id}`);
  }

  // Enviar notificación a un usuario específico
  sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.users.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // Enviar actualización de ticket a todos los usuarios relevantes
  sendTicketUpdate(ticketId: string, update: any) {
    this.server.emit('ticketUpdate', { ticketId, ...update });
  }

  // Enviar notificación de nuevo comentario
  sendNewComment(ticketId: string, comment: any) {
    this.server.emit('newComment', { ticketId, comment });
  }
}