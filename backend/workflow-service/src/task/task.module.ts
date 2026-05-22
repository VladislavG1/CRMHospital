import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskHistoryModule } from 'src/task-history/task-history.module';

@Module({
    imports: [TaskHistoryModule],
    controllers: [TaskController],
    providers: [TaskService, PrismaService]
})
export class TaskModule { }
