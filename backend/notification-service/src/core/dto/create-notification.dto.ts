import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsArray, IsObject, IsOptional } from 'class-validator';

export class CreateNotificationDto {
    @ApiProperty({ example: 'Новое задание', description: 'Название или заголовок уведомления' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'TASK_REJECTED', description: 'Системный код типа уведомления из NotificationType' })
    @IsString()
    @IsNotEmpty()
    typeName: string;

    @ApiProperty({ example: '853e4567-e89b-12d3-a456-426614174000', description: 'ID инициатора события / системы' })
    @IsUUID()
    @IsNotEmpty()
    creator_id: string;

    @ApiProperty({ example: ['IN_APP', 'EMAIL'], description: 'Список каналов для отправки' })
    @IsArray()
    channels: ('IN_APP' | 'EMAIL' | 'TELEGRAM')[];

    @ApiProperty({
        example: { userId: 'uuid-123', email: 'manager@crm.com' },
        description: 'Адресаты для различных транспортов'
    })
    @IsObject()
    targets: {
        userId?: string;
        email?: string;
        tgChatId?: string;
    };

    @ApiProperty({
        example: { task_name: 'Рефакторинг API', comment: 'Не хватает тестов' },
        description: 'Динамические данные для подстановки в шаблон'
    })
    @IsObject()
    @IsOptional()
    context?: Record<string, any>;
}