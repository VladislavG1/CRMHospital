import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateTaskStatusDto {
  @ApiProperty({
    description: 'UUID статуса задачи',
    example: 'e2b0c442-98fc-11eb-a8b3-0242ac130003'
  })
  @IsUUID()
  status_id: string;
}