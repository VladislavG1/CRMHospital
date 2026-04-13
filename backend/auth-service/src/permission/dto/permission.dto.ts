import { IsBoolean, IsOptional, IsObject, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
    @ApiProperty({ example: 'name', description: 'Название разрешения', required: true })
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty({ example: 'desc', description: 'Описание разрешения' })
    @IsOptional()
    @IsString()
    description?: string;
    
    @ApiProperty({ example: 'false', description: 'Разрешение №1' })
    @IsOptional()
    @IsBoolean()
    can_view_a?: boolean = false;
    
    @ApiProperty({ example: 'false', description: 'Разрешение №2' })
    @IsOptional()
    @IsBoolean()
    can_view_b?: boolean = false;
    
    @ApiProperty({ example: 'false', description: 'Разрешение №3' })
    @IsOptional()
    @IsBoolean()
    can_view_c?: boolean = false;
    
    @ApiProperty({ example: 'perm', description: 'Другие разрешения' })
    @IsOptional()
    @IsObject()
    other_perm?: Record<string, any>;
}

export class UpdatePermissionDto extends CreatePermissionDto { }