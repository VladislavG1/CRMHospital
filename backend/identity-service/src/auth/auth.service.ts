import {
	Injectable,
	NotFoundException,
	UnauthorizedException,
	ConflictException,
	Logger
} from '@nestjs/common';
import { JwtAuthService } from '../jwt/jwt.service';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';
import { RegisterInput } from 'src/utils/auth.interfaces';


@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtAuthService,
	) { }

	async getSalt(login: string): Promise<{ password_salt: string }> {
		const user = await this.prisma.mainUser.findFirst({
			where: { OR: [{ username: login }, { email: login }] },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}
		return { password_salt: user.password_salt };
	}

	async login(login: string, passwordHashFromClient: string) {

		const user = await this.prisma.mainUser.findFirst({
			where: { OR: [{ username: login }, { email: login }] },
			include: {
				userRoles: true
			}
		});
		console.log(user);


		if (!this.timingSafeEqualStr(user.password_hash, passwordHashFromClient)) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const payload = { 
			sub: user.id, 
			username: user.username, 
			email: user.email,
			role: user.userRoles?.role_name
		};
		
		return await this.jwtService.generateTokenPair(payload);
	}

	private timingSafeEqualStr(a: string, b: string) {
		if (typeof a !== 'string' || typeof b !== 'string') return false;
		const ab = Buffer.from(a);
		const bb = Buffer.from(b);
		if (ab.length !== bb.length) return false;
		return crypto.timingSafeEqual(ab, bb);
	}

	async refreshTokens(refreshToken: string) {
		const payload = await this.jwtService.verifyRefreshToken(refreshToken);
		return await this.jwtService.generateTokenPair(payload);
	}

	async register(dto: RegisterInput) {
		const exists = await this.prisma.mainUser.findFirst({
			where: {
				OR: [{ username: dto.username }, { email: dto.email }],
			},
			select: { id: true },
		});

		if (exists) {
			throw new ConflictException('User with this username or email already exists');
		}
		// TO-DO: параметры вынести в .env
		const password_salt = crypto.randomBytes(16).toString('hex');
		const iterations = 100_000;
		const keylen = 64;
		const digest = 'sha512';
		const password_hash = crypto
			.pbkdf2Sync(dto.password, password_salt, iterations, keylen, digest)
			.toString('hex');

		const { password, ...userData } = dto;
		const user = await this.prisma.mainUser.create({
			data: {
				...userData,
				password_salt,
				password_hash
			},
			select: {
				id: true,
				email: true,
				username: true,
			},
		});

		const tokens = await this.jwtService.generateTokenPair({
			sub: user.id,
			username: user.username,
			email: user.email,
		});

		return { ...user, ...tokens }
	}
}
