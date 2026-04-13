import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'user', description: 'Имя пользователя', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
  
  @ApiProperty({ example: 'UUID-родителя', description: 'ID родителя' })
  @IsUUID()
  @IsOptional()
  parent_id?: string;
  
  @ApiProperty({ example: 'UUID-главы-департамента', description: 'ID главы департамента' })
  @IsUUID()
  @IsOptional()
  head_id?: string;
  
  @ApiProperty({ example: 'UUID-атрибутов', description: 'ID атрибутов доступа' })
  @IsUUID()
  @IsOptional()
  access_attr_id?: string;
}

export class UpdateDepartmentDto extends CreateDepartmentDto { }