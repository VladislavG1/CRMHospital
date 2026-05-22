import { Controller, Post, Put, Get, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@ApiTags('Calendar: Patient Appointments')
@Controller('appointments')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
    @ApiOperation({ summary: 'Записать пациента на прием (Создать запись)' })
    @ApiResponse({ status: 21, description: 'Успешная запись' })
    @ApiResponse({ status: 400, description: 'Некорректный интервал дат' })
    @ApiResponse({ status: 409, description: 'Конфликт: врач или кабинет заняты' })
    async create(@Body() dto: CreateAppointmentDto) {
        return await this.appointmentService.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Изменить параметры или статус записи' })
    @ApiResponse({ status: 200, description: 'Запись успешно обновлена' })
    @ApiResponse({ status: 404, description: 'Запись не найдена' })
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAppointmentDto) {
        return await this.appointmentService.update(id, dto);
    }

    @Get('doctor/:doctorId')
    @ApiOperation({ summary: 'Получить сетку приемов врача за период' })
    @ApiQuery({ name: 'from', example: '2026-05-25T00:00:00.000Z' })
    @ApiQuery({ name: 'to', example: '2026-05-25T23:59:59.000Z' })
    async getDoctorSchedule(
        @Param('doctorId', ParseUUIDPipe) doctorId: string,
        @Query('from') from: string,
        @Query('to') to: string,
    ) {
        return await this.appointmentService.getDoctorAppointments(doctorId, from, to);
    }

    @Get('patient/:patientId')
    @ApiOperation({ summary: 'Получить историю приемов конкретного пациента' })
    async getPatientHistory(@Param('patientId', ParseUUIDPipe) patientId: string) {
        return await this.appointmentService.getPatientAppointments(patientId);
    }
}