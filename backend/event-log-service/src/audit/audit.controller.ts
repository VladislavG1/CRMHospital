import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@ApiTags('EventLog: Audit')
@Controller('audit')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Post()
    @ApiOperation({ summary: 'Записать действие пользователя' })
    @ApiResponse({ status: 201, description: 'Лог успешно сохранен' })
    async create(@Body() dto: CreateAuditLogDto) {
        return await this.auditService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить логи аудита с фильтрацией' })
    @ApiResponse({ status: 200, description: 'Список логов получен' })
    async findAll(
        @Query('microservice') microservice?: string,
        @Query('userId') userId?: string,
    ) {
        return await this.auditService.findAll(microservice, userId);
    }
}