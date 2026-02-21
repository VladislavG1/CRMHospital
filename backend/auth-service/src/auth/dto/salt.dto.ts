import { IsString } from 'class-validator';

export class SaltDto {
  @IsString()
  login: string;
}
