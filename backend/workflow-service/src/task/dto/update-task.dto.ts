import { IsString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ 
    description: 'Новое название задачи', 
    required: false, 
    example: 'Обновленное название задачи' 
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    description: 'Новое описание задачи', 
    required: false, 
    example: 'Добавил уточнение' 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    description: 'UUID нового статуса (перевод задачи на другой этап)', 
    required: false, 
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' 
  })
  @IsOptional()
  @IsUUID()
  task_status_id?: string;
}