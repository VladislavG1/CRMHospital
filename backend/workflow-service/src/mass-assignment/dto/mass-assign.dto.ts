import { IsString, IsUUID, IsArray, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MassAssignDto {
    @ApiProperty({ 
        description: 'Название для группы создаваемых задач', 
        example: 'Еженедельный отчет по отделу' 
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ 
        description: 'Общее описание для всех задач', 
        required: false, 
        example: 'Необходимо заполнить данные до конца пятницы' 
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ 
        description: 'UUID типа задачи', 
        example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' 
    })
    @IsUUID()
    task_type_id: string;

    @ApiProperty({ 
        description: 'UUID начального статуса', 
        example: 'b1ff9c11-1c0b-4af8-bb1d-1bb9bd111a22' 
    })
    @IsUUID()
    task_status_id: string;

    @ApiProperty({ 
        description: 'Массив UUID пользователей, на которых будут назначены задачи', 
        example: [
            '550e8400-e29b-41d4-a716-446655440000', 
            '661f9511-f30c-52e5-b827-557766551111'
        ],
        type: [String]
    })
    @IsArray()
    @IsUUID("4", { each: true })
    executor_ids: string[];
}