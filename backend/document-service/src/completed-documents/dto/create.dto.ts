import { IsString, IsUUID } from "class-validator"

export class ComplitedDocumentsDTO {
    @IsString()
    @IsUUID()
    name: string
    @IsString()
    @IsUUID()
    creatorId: string
    @IsString()
    @IsUUID()
    templateId: string
    @IsString()
    @IsUUID()
    typeId: string
    @IsString()
    @IsUUID()
    fileId: string
    @IsString()
    @IsUUID()
    statusId: string
}

export class ComplitedDocumentsUpdateDTO {
    @IsString()
    @IsUUID()
    name: string
    @IsString()
    @IsUUID()
    creatorId: string
    @IsString()
    @IsUUID()
    templateId: string
    @IsString()
    @IsUUID()
    typeId: string
    @IsString()
    @IsUUID()
    fileId: string
    @IsString()
    @IsUUID()
    statusId: string
}