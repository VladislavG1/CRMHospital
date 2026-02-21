import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SaltDto } from './dto/salt.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	@Post('salt')
	async getSalt(@Body() dto: SaltDto) {
		return await this.authService.getSalt(dto.login);
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto.login, dto.password_hash);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto);
	}
}
