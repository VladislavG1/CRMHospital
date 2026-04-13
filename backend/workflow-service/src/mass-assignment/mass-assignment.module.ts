import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MassAssignmentController } from './mass-assignment.controller';
import { MassAssignmentService } from './mass-assignment.service';

@Module({
    controllers: [MassAssignmentController],
    providers: [MassAssignmentService, PrismaService]
})
export class MassAssignmentModule { }
