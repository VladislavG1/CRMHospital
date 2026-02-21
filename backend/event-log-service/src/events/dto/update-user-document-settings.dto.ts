import { IsBoolean, IsInt, IsOptional } from 'class-validator';

export class UpdateUserDocumentSettingsDto {
  @IsOptional() @IsBoolean()
  hidden?: boolean;

  @IsOptional() @IsBoolean()
  pinned?: boolean;

  @IsOptional() @IsInt()
  pinnedOrder?: number;
}
