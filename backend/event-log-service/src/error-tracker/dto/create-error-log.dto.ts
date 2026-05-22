import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsObject, IsOptional } from 'class-validator';
import { ErrorSeverity } from '@prisma/client';

export class CreateErrorLogDto {
    @ApiProperty({ example: 'NotificationMicroService' })
    @IsString()
    @IsNotEmpty()
    microservice: string;

    @ApiProperty({ example: 'Failed to send SMTP email to user@hospital.com' })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiProperty({ example: 'Error: connect ECONNREFUSED at TCPConnectWrap.afterConnect', required: false })
    @IsString()
    @IsOptional()
    stack_trace?: string;

    @ApiProperty({ example: 'HIGH', enum: ErrorSeverity, required: false })
    @IsEnum(ErrorSeverity)
    @IsOptional()
    severity?: ErrorSeverity;

    @ApiProperty({ example: { userId: 'uuid-string', attempt: 3 }, required: false })
    @IsObject()
    @IsOptional()
    context?: any;
}