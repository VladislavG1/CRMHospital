import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: CreateAuditLogDto) {
        return await this.prisma.logsActions.create({
            data: {
                user_id: dto.user_id,
                microservice: dto.microservice,
                action: dto.action,
                payload: dto.payload,
                ip_address: dto.ip_address,
            },
        });
    }

    async findAll(microservice?: string, userId?: string) {
        return await this.prisma.logsActions.findMany({
            where: {
                microservice,
                user_id: userId,
            },
            orderBy: {
                date_create: 'desc',
            },
        });
    }
}