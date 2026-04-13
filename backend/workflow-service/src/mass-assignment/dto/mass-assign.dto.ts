import { IsString, IsUUID, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class MassAssignDto {
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

    @IsArray()
    @IsUUID("4", { each: true })
    executor_ids: string[];
}