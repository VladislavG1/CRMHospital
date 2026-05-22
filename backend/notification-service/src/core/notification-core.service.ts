import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TemplateEngineService } from '../template-engine/template-engine.service';
import { TransportService } from '../transport/transport.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotifStatus } from '@prisma/client';

@Injectable()
export class NotificationCoreService {
    private readonly logger = new Logger(NotificationCoreService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly templateEngine: TemplateEngineService,
        private readonly transportService: TransportService,
    ) {}

    async sendNotification(dto: CreateNotificationDto) {
        const notifType = await this.prisma.notificationType.findUnique({
            where: { name: dto.typeName },
        });

        if (!notifType) {
            throw new NotFoundException(`Тип уведомления "${dto.typeName}" не зарегистрирован в системе`);
        }

        const textMessage = this.templateEngine.renderByType(dto.typeName, dto.context || {});

        const notification = await this.prisma.notification.create({
            data: {
                name: dto.name,
                status: NotifStatus.PROCESSING,
                description: textMessage,
                type_id: notifType.id,
                creator_id: dto.creator_id,
            },
        });

        try {
            const transportResults = await this.transportService.send(
                dto.channels,
                dto.targets,
                dto.name,
                textMessage
            );

            const isAnySuccess = Object.values(transportResults).some((result) => result === true);
            const finalStatus = isAnySuccess ? NotifStatus.SENT : NotifStatus.FAILED;

            return await this.prisma.notification.update({
                where: { id: notification.id },
                data: { status: finalStatus },
                include: { notification_type: true }
            });

        } catch (error) {
            this.logger.error(`Критический сбой отправки уведомления ${notification.id}: ${error.message}`);
            
            return await this.prisma.notification.update({
                where: { id: notification.id },
                data: { status: NotifStatus.FAILED },
            });
        }
    }

    async getHistory() {
        return await this.prisma.notification.findMany({
            orderBy: { date_create: 'desc' },
            include: { notification_type: true },
        });
    }
}