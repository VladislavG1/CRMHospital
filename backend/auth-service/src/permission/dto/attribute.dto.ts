import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateAttributeDto {
    @IsString()
    @IsNotEmpty()
    attr_name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUUID()
    @IsOptional()
    permission_id?: string;
}

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}
