import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    namespace: 'notifications',
    cors: { origin: '*' }, // TO-DO указать домен фронтэнда
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private readonly logger = new Logger(NotificationGateway.name);

    private userSockets = new Map<string, string>();

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;

        if (userId) {
            this.userSockets.set(userId, client.id);
            this.logger.log(`Пользователь ${userId} подключился к WebSockets (Socket ID: ${client.id})`);
        }
    }

    handleDisconnect(client: Socket) {
        for (const [userId, socketId] of this.userSockets.entries()) {
            if (socketId === client.id) {
                this.userSockets.delete(userId);
                this.logger.log(`Пользователь ${userId} отключился от WebSockets`);
                break;
            }
        }
    }

    sendToUser(userId: string, event: string, payload: any): boolean {
        const socketId = this.userSockets.get(userId);
        if (socketId) {
            this.server.to(socketId).emit(event, payload);
            return true;
        }
        this.logger.warn(`Не удалось отправить пуш: пользователь ${userId} сейчас оффлайн`);
        return false;
    }
}