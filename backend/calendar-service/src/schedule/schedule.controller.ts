import { Controller, Post, Get, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@ApiTags('Calendar: Department Schedule')
@Controller('schedule')
export class ScheduleController {
    constructor(private readonly scheduleService: ScheduleService) { }

    @Post('shift')
    @ApiOperation({ summary: 'Создать рабочую смену для отделения' })
    @ApiResponse({ status: 201, description: 'Смена успешно создана' })
    @ApiResponse({ status: 400, description: 'Ошибка валидации дат' })
    async createShift(@Body() dto: CreateShiftDto) {
        return await this.scheduleService.createShift(dto);
    }

    @Get('department/:departmentId')
    @ApiOperation({ summary: 'Получить расписание смен отделения за период' })
    @ApiQuery({ name: 'from', example: '2026-05-01T00:00:00.000Z', description: 'Начало периода' })
    @ApiQuery({ name: 'to', example: '2026-05-31T23:59:59.000Z', description: 'Конец периода' })
    @ApiResponse({ status: 200, description: 'Список смен успешно получен' })
    async getDepartmentShifts(
        @Param('departmentId') departmentId: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return await this.scheduleService.getDepartmentShifts(departmentId, from, to);
    }

    @Delete('shift/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Удалить рабочую смену' })
    @ApiResponse({ status: 204, description: 'Смена успешно удалена' })
    @ApiResponse({ status: 404, description: 'Смена не найдена' })
    async deleteShift(@Param('id') id: string) {
        await this.scheduleService.deleteShift(id);
    }
}