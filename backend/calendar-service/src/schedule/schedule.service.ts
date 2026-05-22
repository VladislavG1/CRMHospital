import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ScheduleService {
    private readonly logger = new Logger(ScheduleService.name);

    constructor(private readonly prisma: PrismaService) { }

    async createShift(dto: CreateShiftDto) {
        const start = new Date(dto.start_time);
        const end = new Date(dto.end_time);

        if (end <= start) {
            throw new BadRequestException('Время окончания смены должно быть позже времени начала');
        }

        this.logger.log(`Создание смены для отделения ${dto.department_id}: ${dto.start_time} - ${dto.end_time}`);

        return await this.prisma.workShift.create({
            data: {
                department_id: dto.department_id,
                start_time: start,
                end_time: end,
            },
        });
    }

    async getDepartmentShifts(departmentId: string, fromDate: string, toDate: string) {
        const startPeriod = new Date(fromDate);
        const endPeriod = new Date(toDate);

        if (endPeriod < startPeriod) {
            throw new BadRequestException('Некорректный временной интервал поиска');
        }

        return await this.prisma.workShift.findMany({
            where: {
                department_id: departmentId,
                start_time: { gte: startPeriod },
                end_time: { lte: endPeriod },
            },
            orderBy: {
                start_time: 'asc',
            },
        });
    }

    async deleteShift(id: string) {
        try {
            return await this.prisma.workShift.delete({
                where: { id },
            });
        } catch (error) {
            this.logger.error(`Ошибка при удалении смены ${id}: ${error.message}`);
            throw new NotFoundException(`Смена с ID "${id}" не найдена`);
        }
    }
}