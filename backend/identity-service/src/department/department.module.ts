import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';

@Module({
    controllers: [DepartmentController],
    providers: [DepartmentService, PrismaService]
})
export class PermissionModule { }
