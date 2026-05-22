import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SyncTaskDto } from './dto/sync-task.dto';

@Injectable()
export class EventSyncService {
    private readonly logger = new Logger(EventSyncService.name);

    constructor(private readonly prisma: PrismaService) { }

    async syncTask(dto: SyncTaskDto) {
        const deadlineDate = new Date(dto.deadline);

        this.logger.log(`Синхронизация задачи ${dto.task_id} в календарь пользователя ${dto.user_id}`);

        return await this.prisma.syncedEvent.upsert({
            where: {
                task_id: dto.task_id,
            },
            update: {
                user_id: dto.user_id,
                title: dto.title,
                deadline: deadlineDate,
                date_sync: new Date(),
            },
            create: {
                task_id: dto.task_id,
                user_id: dto.user_id,
                title: dto.title,
                deadline: deadlineDate,
            },
        });
    }

    async unsyncTask(taskId: string) {
        this.logger.log(`Удаление задачи ${taskId} из календаря синхронизации`);
        try {
            return await this.prisma.syncedEvent.delete({
                where: { task_id: taskId },
            });
        } catch (error) {
            this.logger.warn(`Не удалось удалить задачу ${taskId}, возможно она не была синхронизирована: ${error.message}`);
            return null;
        }
    }

    async getUserSyncedEvents(userId: string) {
        return await this.prisma.syncedEvent.findMany({
            where: { user_id: userId },
            orderBy: { deadline: 'asc' },
        });
    }
}