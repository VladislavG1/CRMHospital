import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ApprovalController } from './approval.controller';
import { ApprovalService } from './approval.service';
import { TaskHistoryModule } from 'src/task-history/task-history.module';

@Module({
    imports: [TaskHistoryModule],
    controllers: [ApprovalController],
    providers: [ApprovalService, PrismaService],
    exports: [ApprovalService],
})
export class ApprovalModule { }