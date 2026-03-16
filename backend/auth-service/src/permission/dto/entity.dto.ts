import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateEntityDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsOptional()
    access_attr_id?: string;
}

export class UpdateEntityDto extends PartialType(CreateEntityDto) {}
