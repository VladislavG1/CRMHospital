import { IsBoolean, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDocumentSettingsDto {
  @ApiProperty({
    description: 'Скрыть документ из общего списка пользователя',
    required: false,
    example: false
  })
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;

  @ApiProperty({
    description: 'Закрепить документ вверху списка',
    required: false,
    example: true
  })
  @IsOptional()
  @IsBoolean()
  pinned?: boolean;

  @ApiProperty({
    description: 'Порядковый номер закрепленного документа (для сортировки)',
    required: false,
    example: 1,
    minimum: 0
  })
  @IsOptional()
  @IsInt()
  pinnedOrder?: number;
}