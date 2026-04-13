import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user', description: 'Имя пользователя', required: true })
  @IsString()
  username: string;
  
  @ApiProperty({ example: '123@mail.ru', description: 'Электронная почта', required: true })
  @IsEmail()
  email: string;
  
  @ApiProperty({ example: 'qwerty', description: 'Пароль', required: true })
  @IsString()
  @MinLength(6)
  password: string;
  
  @ApiProperty({ example: 'Иван', description: 'Имя' })
  @IsOptional()
  @IsString()
  firstName: string;
  
  @ApiProperty({ example: 'Иванов', description: 'Фамилия' })
  @IsOptional()
  @IsString()
  lastName: string;
}
