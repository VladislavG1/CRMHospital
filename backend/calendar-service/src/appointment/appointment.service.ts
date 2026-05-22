import { Injectable, BadRequestException, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentService {
    private readonly logger = new Logger(AppointmentService.name);

    constructor(private readonly prisma: PrismaService) {}

    async create(dto: CreateAppointmentDto) {
        const start = new Date(dto.start_time);
        const end = new Date(dto.end_time);

        if (end <= start) {
            throw new BadRequestException('Время окончания приема должно быть строго позже времени начала');
        }

        const doctorConflict = await this.prisma.appointment.findFirst({
            where: {
                doctor_id: dto.doctor_id,
                status: AppointmentStatus.SCHEDULED,
                start_time: { lt: end },
                end_time: { gt: start },
            },
        });

        if (doctorConflict) {
            throw new ConflictException('Этот врач уже занят в выбранный интервал времени');
        }

        const cabinetConflict = await this.prisma.appointment.findFirst({
            where: {
                cabinet: dto.cabinet,
                status: AppointmentStatus.SCHEDULED,
                start_time: { lt: end },
                end_time: { gt: start },
            },
        });

        if (cabinetConflict) {
            throw new ConflictException(`Кабинет ${dto.cabinet} уже занят другим врачом в этот интервал времени`);
        }

        this.logger.log(`Запись пациента ${dto.patient_id} к врачу ${dto.doctor_id} в кабинет ${dto.cabinet}`);

        return await this.prisma.appointment.create({
            data: {
                doctor_id: dto.doctor_id,
                patient_id: dto.patient_id,
                cabinet: dto.cabinet,
                start_time: start,
                end_time: end,
                description: dto.description,
            },
        });
    }

    async update(id: string, dto: UpdateAppointmentDto) {
        const current = await this.prisma.appointment.findUnique({ where: { id } });
        if (!current) throw new NotFoundException(`Запись с ID ${id} не найдена`);

        const start = dto.start_time ? new Date(dto.start_time) : current.start_time;
        const end = dto.end_time ? new Date(dto.end_time) : current.end_time;

        if (end <= start) {
            throw new BadRequestException('Время окончания должно быть позже времени начала');
        }

        if (dto.start_time || dto.end_time || dto.doctor_id || dto.cabinet) {
            const doctorId = dto.doctor_id || current.doctor_id;
            const cabinet = dto.cabinet || current.cabinet;

            const doctorConflict = await this.prisma.appointment.findFirst({
                where: {
                    id: { not: id },
                    doctor_id: doctorId,
                    status: AppointmentStatus.SCHEDULED,
                    start_time: { lt: end },
                    end_time: { gt: start },
                },
            });
            if (doctorConflict) throw new ConflictException('Врач занят в это время');

            const cabinetConflict = await this.prisma.appointment.findFirst({
                where: {
                    id: { not: id },
                    cabinet: cabinet,
                    status: AppointmentStatus.SCHEDULED,
                    start_time: { lt: end },
                    end_time: { gt: start },
                },
            });
            if (cabinetConflict) throw new ConflictException(`Кабинет ${cabinet} занят в это время`);
        }

        return await this.prisma.appointment.update({
            where: { id },
            data: {
                doctor_id: dto.doctor_id,
                patient_id: dto.patient_id,
                cabinet: dto.cabinet,
                start_time: dto.start_time ? start : undefined,
                end_time: dto.end_time ? end : undefined,
                status: dto.status,
                description: dto.description,
            },
        });
    }

    async getDoctorAppointments(doctorId: string, from: string, to: string) {
        return await this.prisma.appointment.findMany({
            where: {
                doctor_id: doctorId,
                start_time: { gte: new Date(from) },
                end_time: { lte: new Date(to) },
            },
            orderBy: { start_time: 'asc' },
        });
    }

    async getPatientAppointments(patientId: string) {
        return await this.prisma.appointment.findMany({
            where: { patient_id: patientId },
            orderBy: { start_time: 'desc' },
        });
    }
}