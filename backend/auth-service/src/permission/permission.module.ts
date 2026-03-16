import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';

@Module({
    controllers: [PermissionController],
    providers: [PermissionService, PrismaService]
})
export class PermissionModule { }
