import { IsString, IsOptional, IsBoolean, IsDateString, IsEnum, IsEmail } from 'class-validator';
import { Sex } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class FindUsersDto {
    @ApiProperty({ description: 'Логин пользователя', required: false, example: 'login' })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ description: 'Email адрес', required: false, example: 'test@example.com' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Имя', required: false, example: 'Иван' })
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @ApiProperty({ description: 'Фамилия', required: false, example: 'Иванов' })
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @ApiProperty({ description: 'Номер телефона', required: false, example: '+79991234567' })
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    @ApiProperty({ description: 'Название роли', required: false, example: 'ADMIN' })
    @IsString()
    @IsOptional()
    role_name?: string;
    
    @ApiProperty({ description: 'Наименование должности', required: false, example: 'Врач-терапевт' })
    @IsString()
    @IsOptional()
    post_name?: string;
    
    @ApiProperty({ description: 'Название департамента', required: false, example: 'Терапевтическое отделение' })
    @IsString()
    @IsOptional()
    department_name?: string;
    
    @ApiProperty({ description: 'Статус активности аккаунта', required: false, example: true })
    @IsBoolean()
    @IsOptional()
    is_active?: boolean;
    
    @ApiProperty({ description: 'Дата рождения (ISO)', required: false, example: '2000-01-01' })
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @ApiProperty({ 
        description: 'Пол пользователя', 
        enum: Sex, 
        required: false,
        example: Sex.male
    })
    @IsEnum(Sex)
    @IsOptional()
    sex?: Sex;
}