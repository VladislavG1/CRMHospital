import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class TaskHistoryService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async log(dto: CreateHistoryDto) {
        return await this.prisma.taskHistory.create({
            data: {
                task_id: dto.task_id,
                user_id: dto.user_id,
                action: dto.action,
                old_value: dto.old_value,
                new_value: dto.new_value,
            },
        });
    }

    async findByTaskId(taskId: string) {
        const taskExists = await this.prisma.tasks.findUnique({
            where: { id: taskId }
        });
        
        if (!taskExists) {
            throw new NotFoundException('Задача не найдена');
        }

        return await this.prisma.taskHistory.findMany({
            where: { task_id: taskId },
            orderBy: { date_create: 'desc' },
        });
    }
}