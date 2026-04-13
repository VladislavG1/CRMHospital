import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MassAssignDto } from './dto/mass-assign.dto';

@Injectable()
export class MassAssignmentService {
    constructor(
        private prisma: PrismaService
    ) { }

    async createMassTask(dto: MassAssignDto, creatorId: string) {
        if (dto.executor_ids.length === 0) {
            throw new BadRequestException('Список исполнителей не может быть пустым');
        }

        return await this.prisma.$transaction(async (tx) => {
            const parentTask = await tx.tasks.create({
                data: {
                    name: `[ОБЩАЯ] ${dto.name}`,
                    description: dto.description,
                    task_type_id: dto.task_type_id,
                    task_status_id: dto.task_status_id,
                }
            });

            await tx.taskUsers.create({
                data: {
                    user_id: creatorId,
                    task_id: parentTask.id
                }
            });

            const taskPromises = dto.executor_ids.map(async (executorId) => {
                const childTask = await tx.tasks.create({
                    data: {
                        name: dto.name,
                        description: dto.description,
                        task_type_id: dto.task_type_id,
                        task_status_id: dto.task_status_id,
                        parent_id: parentTask.id,
                    }
                });

                await tx.taskUsers.create({
                    data: {
                        user_id: executorId,
                        task_id: childTask.id
                    }
                });

                return childTask;
            });

            const createdChildTasks = await Promise.all(taskPromises);

            return {
                message: 'Массовая задача успешно создана',
                parentId: parentTask.id,
                totalCreated: createdChildTasks.length
            };
        });
    }
}