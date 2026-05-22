import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { TaskHistoryController } from './task-history.controller';
import { TaskHistoryService } from './task-history.service';

@Module({
    controllers: [TaskHistoryController],
    providers: [TaskHistoryService, PrismaService],
    exports: [TaskHistoryService]
})
export class TaskHistoryModule { }