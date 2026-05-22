import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
    @ApiProperty({ example: 'Нужно поправить поля для подписей в документе', description: 'Текст комментария' })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'UUID задачи' })
    @IsUUID()
    @IsNotEmpty()
    task_id: string;
}