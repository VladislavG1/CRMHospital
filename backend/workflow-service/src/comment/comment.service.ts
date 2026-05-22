import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(dto: CreateCommentDto, userId: string) {
        const taskExists = await this.prisma.tasks.findUnique({
            where: { id: dto.task_id }
        });
        if (!taskExists) {
            throw new NotFoundException('Задача, к которой вы пытаетесь оставить комментарий, не найдена');
        }

        return await this.prisma.taskComments.create({
            data: {
                text: dto.text,
                task_id: dto.task_id,
                user_id: userId
            }
        });
    }

    async findByTaskId(taskId: string) {
        const taskExists = await this.prisma.tasks.findUnique({
            where: { id: taskId }
        });
        if (!taskExists) {
            throw new NotFoundException('Задача не найдена');
        }

        return await this.prisma.taskComments.findMany({
            where: { task_id: taskId },
            orderBy: { date_create: 'asc' }
        });
    }

    async remove(id: string, userId: string) {
        const comment = await this.prisma.taskComments.findUnique({
            where: { id }
        });

        if (!comment) {
            throw new NotFoundException('Комментарий не найден');
        }

        if (comment.user_id !== userId) {
            throw new ForbiddenException('Вы можете удалять только собственные комментарии');
        }

        return await this.prisma.taskComments.delete({
            where: { id }
        });
    }
}