import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskHistoryService } from 'src/task-history/task-history.service';

@Injectable()
export class TaskService {
    constructor(
        private prisma: PrismaService,
        private historyService: TaskHistoryService
    ) { }

    async create(dto: CreateTaskDto, userId: string) {
        const task = await this.prisma.tasks.create({
            data: {
                name: dto.name,
                description: dto.description,
                task_type: { connect: { id: dto.task_type_id } },
                task_status: { connect: { id: dto.task_status_id } },
                ...(dto.parent_id && { parent: { connect: { id: dto.parent_id } } }),
            },
            include: { task_status: true, task_type: true }
        });

        await this.historyService.log({
            task_id: task.id,
            user_id: userId,
            action: 'TASK_CREATED',
            new_value: `Задача успешно создана с типом ${task.task_type.name}`
        });

        return task;
    }
    
    async findAll(parent_id?: string, status_id?: string) {
        return await this.prisma.tasks.findMany({
            where: {
                parent_id: parent_id || null,
                task_status_id: status_id
            },
            include: {
                task_status: true,
                task_type: true,
                _count: { select: { children: true, Task_users: true } }
            }
        });
    }
    
    async findOne(id: string) {
        const task = await this.prisma.tasks.findUnique({
            where: { id },
            include: {
                task_status: true,
                task_type: true,
                parent: true,
                children: { include: { task_status: true } },
                Task_users: true
            }
        });

        if (!task) throw new NotFoundException('Задача не найдена');
        return task;
    }

    async updateStatus(id: string, newStatusId: string, userId: string) {
        const task = await this.findOne(id);
        const targetStatus = await this.prisma.taskStatus.findUnique({
            where: { id: newStatusId }
        });

        if (!targetStatus) throw new NotFoundException('Статус не найден');

        this.validateStatusTransition(task.task_status.name, targetStatus.name);

        const updatedTask = await this.prisma.tasks.update({
            where: { id },
            data: { task_status_id: newStatusId },
            include: { task_status: true }
        });

        await this.historyService.log({
            task_id: id,
            user_id: userId,
            action: 'STATUS_CHANGED',
            old_value: task.task_status.name,
            new_value: targetStatus.name
        });

        return updatedTask;
    }

    private validateStatusTransition(current: string, next: string) {
        const workflow: Record<string, string[]> = {
            'NEW': ['ACKNOWLEDGED', 'CANCELLED'],
            'ACKNOWLEDGED': ['IN_PROGRESS', 'CANCELLED'],
            'IN_PROGRESS': ['ON_APPROVAL', 'CANCELLED'],
            'ON_APPROVAL': ['COMPLETED', 'REJECTED'],
            'REJECTED': ['IN_PROGRESS', 'CANCELLED'],
            'COMPLETED': [],
            'CANCELLED': []
        };

        if (!workflow[current]?.includes(next)) {
            throw new BadRequestException(`Нельзя перевести задачу из ${current} в ${next}`);
        }
    }

    async remove(id: string) {
        return await this.prisma.tasks.delete({ where: { id } });
    }

    async update(id: string, dto: UpdateTaskDto, userId: string) {
        const currentTask = await this.findOne(id);

        const updatedTask = await this.prisma.tasks.update({
            where: { id },
            data: {
                name: dto.name,
                description: dto.description,
                task_status_id: dto.task_status_id
            }
        });

        await this.historyService.log({
            task_id: id,
            user_id: userId,
            action: 'TASK_UPDATED',
            old_value: `Имя: ${currentTask.name}, Описание: ${currentTask.description}`,
            new_value: `Имя: ${dto.name}, Описание: ${dto.description}`
        });

        return updatedTask;
    }

    async getTaskTypes() {
        return this.prisma.taskType.findMany({
            orderBy: { name: 'asc' }
        });
    }

    async getTaskStatuses() {
        return this.prisma.taskStatus.findMany({
            orderBy: { name: 'asc' }
        });
    }

}