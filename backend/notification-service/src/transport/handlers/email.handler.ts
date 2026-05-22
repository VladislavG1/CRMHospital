import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailHandler {
    private readonly logger = new Logger(EmailHandler.name);

    async send(email: string, title: string, message: string): Promise<boolean> {
        this.logger.log(`Отправка Email на адрес ${email}...`);
        try {
            // TO-DO реализовать отправку писем через nodemailer
            this.logger.log(`Email успешно отправлен на ${email}`);
            return true;
        } catch (error) {
            this.logger.error(`Ошибка при отправке Email на ${email}: ${error.message}`);
            return false;
        }
    }
}