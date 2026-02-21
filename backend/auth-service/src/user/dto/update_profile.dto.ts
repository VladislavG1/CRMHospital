import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Sex } from '@prisma/client';


export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @IsEnum(Sex)
    @IsOptional()
    sex?: Sex;
}