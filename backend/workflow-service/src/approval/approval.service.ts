import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskHistoryService } from 'src/task-history/task-history.service';

@Injectable()
export class ApprovalService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly historyService: TaskHistoryService
    ) { }

    private async getStatusIdByName(name: string): Promise<string> {
        const status = await this.prisma.taskStatus.findUnique({
            where: { name },
        });
        if (!status) {
            throw new NotFoundException(`Статус задачи с именем "${name}" не найден в системе`);
        }
        return status.id;
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
            throw new BadRequestException(`Нельзя перевести задачу из статуса ${current} в ${next}`);
        }
    }

    async submitForApproval(taskId: string, userId: string) {
        const task = await this.prisma.tasks.findUnique({
            where: { id: taskId },
            include: { task_status: true, Task_users: true },
        });

        if (!task) throw new NotFoundException('Задача не найдена');

        const isExecutor = task.Task_users.some((u) => u.user_id === userId);
        if (!isExecutor) {
            throw new BadRequestException('Вы не можете отправить эту задачу на согласование, так как не являетесь её исполнителем');
        }

        this.validateStatusTransition(task.task_status.name, 'ON_APPROVAL');
        const targetStatusId = await this.getStatusIdByName('ON_APPROVAL');

        const result = await this.prisma.tasks.update({
            where: { id: taskId },
            data: { task_status_id: targetStatusId },
            include: { task_status: true, task_type: true }
        });

        await this.historyService.log({
            task_id: taskId,
            user_id: userId,
            action: 'STATUS_CHANGED',
            old_value: task.task_status.name,
            new_value: 'ON_APPROVAL'
        });

        return result;
    }

    async approve(taskId: string, userId: string) {
        const task = await this.prisma.tasks.findUnique({
            where: { id: taskId },
            include: { task_status: true },
        });

        if (!task) throw new NotFoundException('Задача не найдена');

        this.validateStatusTransition(task.task_status.name, 'COMPLETED');
        const targetStatusId = await this.getStatusIdByName('COMPLETED');

        const result = await this.prisma.tasks.update({
            where: { id: taskId },
            data: { task_status_id: targetStatusId },
            include: { task_status: true, task_type: true }
        });

        await this.historyService.log({
            task_id: taskId,
            user_id: userId,
            action: 'STATUS_CHANGED',
            old_value: task.task_status.name,
            new_value: 'COMPLETED'
        });

        return result;
    }

    async reject(taskId: string, userId: string) {
        const task = await this.prisma.tasks.findUnique({
            where: { id: taskId },
            include: { task_status: true },
        });

        if (!task) throw new NotFoundException('Задача не найдена');

        this.validateStatusTransition(task.task_status.name, 'REJECTED');
        const targetStatusId = await this.getStatusIdByName('REJECTED');

        const result = await this.prisma.tasks.update({
            where: { id: taskId },
            data: { task_status_id: targetStatusId },
            include: { task_status: true, task_type: true }
        });

        await this.historyService.log({
            task_id: taskId,
            user_id: userId,
            action: 'STATUS_CHANGED',
            old_value: task.task_status.name,
            new_value: 'REJECTED'
        });

        return result;
    }
}