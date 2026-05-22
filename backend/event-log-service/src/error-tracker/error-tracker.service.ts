import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { ErrorSeverity } from '@prisma/client';

@Injectable()
export class ErrorTrackerService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateErrorLogDto) {
        return await this.prisma.errorLogs.create({
            data: {
                microservice: dto.microservice,
                message: dto.message,
                stack_trace: dto.stack_trace,
                severity: dto.severity,
                context: dto.context,
            },
        });
    }

    async findAll(microservice?: string, severity?: ErrorSeverity) {
        return await this.prisma.errorLogs.findMany({
            where: {
                microservice,
                severity,
            },
            orderBy: {
                date_create: 'desc',
            },
        });
    }
}