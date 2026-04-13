import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Sex } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiProperty({ 
        description: 'Имя пользователя', 
        required: false, 
        example: 'Андрей' 
    })
    @IsString()
    @IsOptional()
    firstName?: string;
    
    @ApiProperty({ 
        description: 'Фамилия пользователя', 
        required: false, 
        example: 'Андреев' 
    })
    @IsString()
    @IsOptional()
    lastName?: string;
    
    @ApiProperty({ 
        description: 'Контактный номер телефона', 
        required: false, 
        example: '+79001112233' 
    })
    @IsString()
    @IsOptional()
    phone_number?: string;
    
    @ApiProperty({ 
        description: 'Дата рождения в формате ISO 8601', 
        required: false, 
        example: '1995-05-15' 
    })
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