import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  task_type_id: string;

  @IsUUID()
  task_status_id: string;

  @IsUUID()
  @IsOptional()
  parent_id?: string;
}
