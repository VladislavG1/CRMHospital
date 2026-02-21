import { IsString, IsOptional, IsUUID, IsBoolean, IsDateString, IsEnum, IsEmail } from 'class-validator';
import { Sex } from '@prisma/client';


export class UpdateUserDto {
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
    
    @IsUUID()
    @IsOptional()
    role_id?: string;
    
    @IsUUID()
    @IsOptional()
    post_id?: string;
    
    @IsUUID()
    @IsOptional()
    department_id?: string;
    
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @IsEnum(Sex)
    @IsOptional()
    sex?: Sex;
}