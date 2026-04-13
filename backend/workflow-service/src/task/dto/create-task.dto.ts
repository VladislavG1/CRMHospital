import { IsString, IsUUID, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ 
    description: 'Название задачи', 
    example: 'Ознакомиться с предписанием о цифровизации рабочего процесса' 
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ 
    description: 'Подробное описание задачи', 
    required: false, 
    example: 'Принять к сведению предписание о внедрении национального мессенджера MAX в корпоративный процесс' 
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    description: 'UUID типа задачи (из справочника типов)', 
    example: 'e3b0c442-98fc-11eb-a8b3-0242ac130003' 
  })
  @IsUUID()
  task_type_id: string;

  @ApiProperty({ 
    description: 'UUID начального статуса задачи', 
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' 
  })
  @IsUUID()
  task_status_id: string;

  @ApiProperty({ 
    description: 'UUID родительской задачи (если это подзадача)', 
    required: false, 
    example: '7cc933f0-98fc-11eb-a8b3-0242ac130003' 
  })
  @IsUUID()
  @IsOptional()
  parent_id?: string;
}