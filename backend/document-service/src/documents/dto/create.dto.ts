import { IsNotEmpty, IsString, IsOptional, MaxLength, IsUUID } from 'class-validator';

export class CreateDocumentDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    name: string;

    @IsString()
    description?: string;

    @IsString()
    creatorId?: string;

    @IsString()
    @IsUUID()
    templateId?: string;

    @IsString()
    @IsUUID()
    typeId: string;

    @IsString()
    @IsUUID()
    statusId: string;
}

export class createStatusDto {
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    description: string

}

export class createTypeDto { 
    @IsString()
    @IsNotEmpty()
    name: string
    
    @IsString()
    description: string
}

export class updateStatusDto {
    @IsString()
    name: string
    
    @IsString()
    description: string
}

export class updateTypeDto {
    @IsString()
    name: string
    
    @IsString()
    description: string
}