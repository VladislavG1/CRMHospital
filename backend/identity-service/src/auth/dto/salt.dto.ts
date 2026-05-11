import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaltDto {
  @ApiProperty({ example: 'user', description: 'Имя пользователя', required: true })
  @IsString()
  login: string;
}
