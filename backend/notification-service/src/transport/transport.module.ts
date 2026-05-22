import { Module } from '@nestjs/common';
import { NotificationGateway } from './handlers/notification.gateway';
import { InAppHandler } from './handlers/in-app.handler';
import { EmailHandler } from './handlers/email.handler';
import { TelegramSmsHandler } from './handlers/telegram-sms.handler';
import { TransportService } from './transport.service';

@Module({
    providers: [
        NotificationGateway,
        InAppHandler,
        EmailHandler,
        TelegramSmsHandler,
        TransportService,
    ],
    exports: [TransportService],
})
export class TransportModule { }