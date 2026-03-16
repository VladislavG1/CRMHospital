import { IsBoolean, IsOptional, IsObject, IsString, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsBoolean()
    can_view_a?: boolean = false;

    @IsOptional()
    @IsBoolean()
    can_view_b?: boolean = false;

    @IsOptional()
    @IsBoolean()
    can_view_c?: boolean = false;

    @IsOptional()
    @IsObject()
    other_perm?: Record<string, any>;
}

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}