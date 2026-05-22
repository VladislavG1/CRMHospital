import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsObject, IsOptional } from 'class-validator';

export class CreateAuditLogDto {
    @ApiProperty({ example: 'd3b07384-d113-49cd-a5d6-8ee000156000' })
    @IsUUID()
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ example: 'CalendarMicroService' })
    @IsString()
    @IsNotEmpty()
    microservice: string;

    @ApiProperty({ example: 'CREATE_APPOINTMENT' })
    @IsString()
    @IsNotEmpty()
    action: string;

    @ApiProperty({ example: { appointment_id: 'uuid-value' }, required: false })
    @IsObject()
    @IsOptional()
    payload?: any;

    @ApiProperty({ example: '192.168.1.105', required: false })
    @IsString()
    @IsOptional()
    ip_address?: string;
}