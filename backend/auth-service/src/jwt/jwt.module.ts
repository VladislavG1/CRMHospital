import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('SecretKeyJwt'),
                signOptions: {
                    expiresIn: configService.get<string>('AccessTokenJwt', '15m')
                },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [JwtAuthService, JwtStrategy, JwtRefreshStrategy],
    exports: [JwtAuthService, NestJwtModule],
})
export class JwtModule { }