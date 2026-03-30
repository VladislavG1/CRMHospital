import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsOptional()
  parent_id?: string;

  @IsUUID()
  @IsOptional()
  head_id?: string;

  @IsUUID()
  @IsOptional()
  access_attr_id?: string;
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}