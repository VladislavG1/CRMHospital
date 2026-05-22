import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsDateString, IsOptional, MaxLength } from 'class-validator';

export class CreateAppointmentDto {
    @ApiProperty({ example: 'd3b07384-d113-49cd-a5d6-8ee000156000', description: 'ID врача' })
    @IsUUID()
    @IsNotEmpty()
    doctor_id: string;

    @ApiProperty({ example: 'a1a07384-b113-49cd-a5d6-8ee000156111', description: 'ID пациента' })
    @IsUUID()
    @IsNotEmpty()
    patient_id: string;

    @ApiProperty({ example: '404-А', description: 'Номер кабинета' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    cabinet: string;

    @ApiProperty({ example: '2026-05-25T09:00:00.000Z', description: 'Начало приема' })
    @IsDateString()
    @IsNotEmpty()
    start_time: string;

    @ApiProperty({ example: '2026-05-25T09:30:00.000Z', description: 'Конец приема' })
    @IsDateString()
    @IsNotEmpty()
    end_time: string;

    @ApiProperty({ example: 'Первичный осмотр, жалобы на боли в колене', description: 'Примечание', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}