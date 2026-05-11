import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateTempDocumentDto {
    @ApiProperty({ 
        description: 'Название шаблона документа', 
        example: 'Шаблон закупки оборудования' 
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        description: 'Описание шаблона и его назначения', 
        required: false, 
        example: 'Используется для генерации типовых договоров закупки оборудования' 
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        description: 'Схема данных шаблона в формате JSON', 
        example: { title: "Contract", fields: ["date", "party_a", "party_b"] } 
    })
    @IsJSON()
    @IsNotEmpty()
    JsonData: object;

    @ApiProperty({ 
        description: 'Версия шаблона', 
        example: '1.0.2' 
    })
    @IsString()
    version: string;

    @ApiProperty({ 
        description: 'UUID типа документа, к которому привязан шаблон', 
        example: '772a0622-a41d-63f6-c938-668877662222' 
    })
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    dosc_type: string;
}

export class UpdateTempDocumentDto {
    @ApiProperty({ description: 'Название шаблона', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'Описание', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Обновленная JSON-схема шаблона', required: false })
    @IsJSON()
    @IsOptional()
    JsonData?: object;

    @ApiProperty({ description: 'Новая версия шаблона', required: false, example: '1.1.0' })
    @IsString()
    @IsOptional()
    version?: string;

    @ApiProperty({ description: 'UUID типа документа', required: false })
    @IsString()
    @IsOptional()
    @IsUUID()
    dosc_type?: string;
}