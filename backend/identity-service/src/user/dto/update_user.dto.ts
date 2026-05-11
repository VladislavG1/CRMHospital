import { IsString, IsOptional, IsUUID, IsBoolean, IsDateString, IsEnum, IsEmail } from 'class-validator';
import { Sex } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger'; // Импортируем декоратор

export class UpdateUserDto {
    @ApiProperty({ description: 'Новый логин пользователя', required: false, example: 'login_admin' })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({ description: 'Новый Email', required: false, example: 'new_email@work.ru' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ description: 'Имя', required: false, example: 'Алексей' })
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @ApiProperty({ description: 'Фамилия', required: false, example: 'Алексеев' })
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @ApiProperty({ description: 'Номер телефона', required: false, example: '+79998887766' })
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    @ApiProperty({ 
        description: 'UUID новой роли', 
        required: false, 
        example: '550e8400-e29b-41d4-a716-446655440000' 
    })
    @IsUUID()
    @IsOptional()
    role_id?: string;
    
    @ApiProperty({ 
        description: 'UUID новой должности (поста)', 
        required: false, 
        example: '661f9511-f30c-52e5-b827-557766551111' 
    })
    @IsUUID()
    @IsOptional()
    post_id?: string;
    
    @ApiProperty({ 
        description: 'UUID нового департамента', 
        required: false, 
        example: '772a0622-a41d-63f6-c938-668877662222' 
    })
    @IsUUID()
    @IsOptional()
    department_id?: string;
    
    @ApiProperty({ description: 'Дата рождения', required: false, example: '2000-03-15' })
    @IsDateString()
    @IsOptional()
    birth_date?: string;

    @ApiProperty({ 
        description: 'Пол', 
        enum: Sex, 
        required: false,
        example: Sex.male 
    })
    @IsEnum(Sex)
    @IsOptional()
    sex?: Sex;
}