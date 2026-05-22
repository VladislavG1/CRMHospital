import { Injectable, Logger } from '@nestjs/common';
import { InAppHandler } from './handlers/in-app.handler';
import { EmailHandler } from './handlers/email.handler';
import { TelegramSmsHandler } from './handlers/telegram-sms.handler';

export interface NotificationTargets {
    userId?: string;
    email?: string;
    tgChatId?: string;
}

@Injectable()
export class TransportService {
    private readonly logger = new Logger(TransportService.name);

    constructor(
        private readonly inAppHandler: InAppHandler,
        private readonly emailHandler: EmailHandler,
        private readonly telegramSmsHandler: TelegramSmsHandler,
    ) { }

    async send(
        channels: ('IN_APP' | 'EMAIL' | 'TELEGRAM')[],
        targets: NotificationTargets,
        title: string,
        message: string
    ): Promise<Record<string, boolean>> {
        const results: Record<string, boolean> = {};

        const promises = channels.map(async (channel) => {
            if (channel === 'IN_APP' && targets.userId) {
                results['IN_APP'] = await this.inAppHandler.send(targets.userId, title, message);
            }
            if (channel === 'EMAIL' && targets.email) {
                results['EMAIL'] = await this.emailHandler.send(targets.email, title, message);
            }
            if (channel === 'TELEGRAM' && targets.tgChatId) {
                results['TELEGRAM'] = await this.telegramSmsHandler.sendToTelegram(targets.tgChatId, message);
            }
        });

        await Promise.all(promises);
        return results;
    }
}