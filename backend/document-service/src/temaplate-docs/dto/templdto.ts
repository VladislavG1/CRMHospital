import { IsJSON, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateTempDocumentDto {

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;

    @IsJSON()
    @IsNotEmpty()
    JsonData: object;

    @IsString()
    version: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    dosc_type: string;


}

export class updateTempDocumetnDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;

    @IsJSON()
    @IsNotEmpty()
    JsonData: object;

    @IsString()
    version: string;

    @IsString()
    @IsNotEmpty()
    @IsUUID()
    dosc_type: string;
    
}