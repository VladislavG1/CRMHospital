import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user', description: 'Имя пользователя', required: true })
  @IsString()
  login: string;
  
  @ApiProperty({ example: 'qwerty', description: 'Пароль', required: true })
  @IsString()
  @MinLength(16)
  password_hash: string;
}
