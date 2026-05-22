import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ErrorTrackerService } from './error-tracker.service';
import { CreateErrorLogDto } from './dto/create-error-log.dto';
import { ErrorSeverity } from '@prisma/client';

@ApiTags('EventLog: Error Tracker')
@Controller('errors')
export class ErrorTrackerController {
    constructor(private readonly errorTrackerService: ErrorTrackerService) { }

    @Post()
    @ApiOperation({ summary: 'Зарегистрировать системную ошибку' })
    @ApiResponse({ status: 201, description: 'Лог ошибки успешно сохранен' })
    async create(@Body() dto: CreateErrorLogDto) {
        return await this.errorTrackerService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список зарегистрированных ошибок' })
    @ApiResponse({ status: 200, description: 'Список логов получен' })
    async findAll(
        @Query('microservice') microservice?: string,
        @Query('severity') severity?: ErrorSeverity,
    ) {
        return await this.errorTrackerService.findAll(microservice, severity);
    }
}