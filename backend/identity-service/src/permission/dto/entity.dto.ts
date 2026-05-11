import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEntityDto {
    @ApiProperty({ example: 'name', description: 'Название сущности', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ example: 'UUID-атрибута', description: 'ID атрибута доступа' })
    @IsUUID()
    @IsOptional()
    access_attr_id?: string;
}

export class UpdateEntityDto extends PartialType(CreateEntityDto) { }
