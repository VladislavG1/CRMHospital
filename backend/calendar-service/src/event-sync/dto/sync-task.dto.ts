import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsDateString, MaxLength } from 'class-validator';

export class SyncTaskDto {
    @ApiProperty({ example: 'e1b07384-d113-49cd-a5d6-8ee000156999', description: 'ID задачи' })
    @IsUUID()
    @IsNotEmpty()
    task_id: string;

    @ApiProperty({ example: 'd3b07384-d113-49cd-a5d6-8ee000156000', description: 'ID исполнителя задачи' })
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 'Подготовить операционную к 12:00', description: 'Название задачи' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(128)
    title: string;

    @ApiProperty({ example: '2026-05-25T12:00:00.000Z', description: 'Срок выполнения (дедлайн)' })
    @IsDateString()
    @IsNotEmpty()
    deadline: string;
}