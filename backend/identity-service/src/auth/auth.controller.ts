import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SaltDto } from './dto/salt.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Identity: Authorizarion')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Получение соли пароля' })
	@Post('salt')
	async getSalt(@Body() dto: SaltDto) {
		return await this.authService.getSalt(dto.login);
	}
	
	@ApiOperation({ summary: 'Авторизация' })
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto.login, dto.password_hash);
	}
	
	@ApiOperation({ summary: 'Регистрация' })
	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto);
	}
}
