import { Injectable, Logger } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class InAppHandler {
    private readonly logger = new Logger(InAppHandler.name);

    constructor(private readonly gateway: NotificationGateway) { }

    async send(userId: string, title: string, message: string): Promise<boolean> {
        this.logger.log(`Отправка In-App уведомления для пользователя ${userId}`);

        return this.gateway.sendToUser(userId, 'notification_received', {
            title,
            message,
            timestamp: new Date()
        });
    }
}
