import { IsIP, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString() event_type: string;
  @IsString() event_name: string;
  @IsString() service_name: string;
  @IsString() entity_type: string;
  @IsString() entity_id: string;
  @IsString() user_id: string;
  @IsOptional() @IsIP('4', { message: 'ip must be IPv4/IPv6' }) ip_address?: string;
}
