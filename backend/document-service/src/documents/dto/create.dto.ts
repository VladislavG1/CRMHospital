import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
    @ApiProperty({ description: 'Название документа', example: 'Приказ о приеме на работу', maxLength: 64 })
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    name: string;

    @ApiProperty({ description: 'Описание документа', required: false, example: 'Основной приказ по отделу кадров' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'ID создателя (UUID)', required: false, example: '550e8400-e29b-41d4-a716-446655440000' })
    @IsString()
    @IsOptional()
    creatorId?: string;

    @ApiProperty({ description: 'ID шаблона (UUID)', required: false, example: '661f9511-f30c-52e5-b827-557766551111' })
    @IsString()
    @IsUUID()
    @IsOptional()
    templateId?: string;

    @ApiProperty({ description: 'ID типа документа (UUID)', example: '772a0622-a41d-63f6-c938-668877662222' })
    @IsString()
    @IsUUID()
    typeId: string;

    @ApiProperty({ description: 'ID начального статуса (UUID)', example: '883b1733-b52e-74f7-d049-779988773333' })
    @IsString()
    @IsUUID()
    statusId: string;
}

export class CreateStatusDto {
    @ApiProperty({ description: 'Название статуса', example: 'На согласовании' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Описание смысла статуса', example: 'Документ ожидает подписи руководителей' })
    @IsString()
    description: string;
}

export class CreateTypeDto {
    @ApiProperty({ description: 'Название типа документа', example: 'Договор' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Описание типа', example: 'Юридически значимые соглашения сторон' })
    @IsString()
    description: string;
}

export class UpdateStatusDto {
    @ApiProperty({ description: 'Новое название статуса', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Новое описание статуса', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateTypeDto {
    @ApiProperty({ description: 'Новое название типа', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Новое описание типа', required: false })
    @IsString()
    @IsOptional()
    description?: string;
}