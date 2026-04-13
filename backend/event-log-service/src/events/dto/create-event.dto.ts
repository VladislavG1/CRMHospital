import { IsIP, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ 
    description: 'Категория события', 
    example: 'AUTH_ACTION'
  })
  @IsString() 
  event_type: string;

  @ApiProperty({ 
    description: 'Конкретное действие', 
    example: 'USER_LOGIN_SUCCESS' 
  })
  @IsString() 
  event_name: string;

  @ApiProperty({ 
    description: 'Название микросервиса-источника', 
    example: 'IdentityMicroService' 
  })
  @IsString() 
  service_name: string;

  @ApiProperty({ 
    description: 'Тип сущности, с которой произведено действие', 
    example: 'User' 
  })
  @IsString() 
  entity_type: string;

  @ApiProperty({ 
    description: 'UUID затронутой сущности', 
    example: '550e8400-e29b-41d4-a716-446655440000' 
  })
  @IsString() 
  entity_id: string;

  @ApiProperty({ 
    description: 'UUID пользователя, совершившего действие', 
    example: '7cc933f0-98fc-11eb-a8b3-0242ac130003' 
  })
  @IsString() 
  user_id: string;

  @ApiProperty({ 
    description: 'IP-адрес пользователя (v4 или v6)', 
    required: false, 
    example: '192.168.1.1' 
  })
  @IsOptional() 
  @IsIP('4', { message: 'ip must be IPv4/IPv6' }) 
  ip_address?: string;
}