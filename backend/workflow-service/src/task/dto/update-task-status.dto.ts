import { IsUUID } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsUUID() 
  status_id: string;
}