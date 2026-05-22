import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';

export class CreateShiftDto {
    @ApiProperty({ example: 'b92e4567-e89b-12d3-a456-426614174000', description: 'ID отделения больницы' })
    @IsUUID()
    @IsNotEmpty()
    department_id: string;

    @ApiProperty({ example: '2026-05-25T08:00:00.000Z', description: 'Дата и время начала смены' })
    @IsDateString()
    @IsNotEmpty()
    start_time: string;

    @ApiProperty({ example: '2026-05-25T16:00:00.000Z', description: 'Дата и время окончания смены' })
    @IsDateString()
    @IsNotEmpty()
    end_time: string;
}