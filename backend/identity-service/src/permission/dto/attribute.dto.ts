import { IsOptional, IsString, IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateAttributeDto {
    @ApiProperty({ example: 'attr_name', description: 'Название атрибута', required: true })
    @IsString()
    @IsNotEmpty()
    attr_name: string;
    
    @ApiProperty({ example: 'desc', description: 'Описание атрибута' })
    @IsString()
    @IsOptional()
    description?: string;
    
    @ApiProperty({ example: 'UUID-разрешения', description: 'ID разрешения' })
    @IsUUID()
    @IsOptional()
    permission_id?: string;
}

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) { }
