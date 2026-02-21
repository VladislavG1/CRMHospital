import { IsString, IsOptional, IsUUID, IsBoolean, IsDateString, IsEnum, IsEmail } from 'class-validator';
import { Sex } from '@prisma/client';


export class FindUsersDto {
    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    firstName?: string;
    
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    @IsString()
    @IsOptional()
    role_name?: string;
    
    @IsString()
    @IsOptional()
    post_name?: string;
    
    @IsString()
    @IsOptional()
    department_name?: string;
    
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
    
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @IsEnum(Sex)
    @IsOptional()
    sex?: Sex;
}