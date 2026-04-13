import { IsString, IsUUID, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ComplitedDocumentsDTO {
    @ApiProperty({
        description: 'Название документа',
        example: 'Договор купли-продажи №15'
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'UUID создателя документа',
        example: '550e8400-e29b-41d4-a716-446655440000'
    })
    @IsString()
    @IsUUID()
    creatorId: string;

    @ApiProperty({
        description: 'UUID использованного шаблона',
        example: '661f9511-f30c-52e5-b827-557766551111'
    })
    @IsString()
    @IsUUID()
    templateId: string;

    @ApiProperty({
        description: 'UUID типа документа (Счет, Приказ и т.д.)',
        example: '772a0622-a41d-63f6-c938-668877662222'
    })
    @IsString()
    @IsUUID()
    typeId: string;

    @ApiProperty({
        description: 'UUID файла в хранилище',
        example: '883b1733-b52e-74f7-d049-779988773333'
    })
    @IsString()
    @IsUUID()
    fileId: string;

    @ApiProperty({
        description: 'UUID текущего статуса документа',
        example: '994c2844-c63f-8508-e150-880099884444'
    })
    @IsString()
    @IsUUID()
    statusId: string;
}

export class ComplitedDocumentsUpdateDTO {
    @ApiProperty({ description: 'Новое название документа', required: false, example: 'Договор (ред. от 13.04)' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ description: 'UUID нового создателя (если нужно сменить владельца)', required: false })
    @IsString()
    @IsUUID()
    @IsOptional()
    creatorId?: string;

    @ApiProperty({ description: 'UUID нового шаблона', required: false })
    @IsString()
    @IsUUID()
    @IsOptional()
    templateId?: string;

    @ApiProperty({ description: 'UUID нового типа документа', required: false })
    @IsString()
    @IsUUID()
    @IsOptional()
    typeId?: string;

    @ApiProperty({ description: 'UUID нового файла (новая версия документа)', required: false })
    @IsString()
    @IsUUID()
    @IsOptional()
    fileId?: string;

    @ApiProperty({ description: 'UUID нового статуса', required: false })
    @IsString()
    @IsUUID()
    @IsOptional()
    statusId?: string;
}