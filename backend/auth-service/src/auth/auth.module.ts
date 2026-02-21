import { Logger, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '../jwt/jwt.module';
import { PrismaService } from '../prisma.service';

@Module({
	imports: [JwtModule],
	controllers: [AuthController],
	providers: [AuthService, PrismaService],
	exports: [AuthService],
})
export class AuthModule { }
