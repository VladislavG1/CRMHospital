import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenPair } from './interfaces/token-pair.interface';

@Injectable()
export class JwtAuthService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateTokenPair(payload: JwtPayload): Promise<TokenPair> {
        console.log(payload, "payload");
        console.log(this.configService.get<string>('SecretKeyJwt'));
        const [accessToken, refreshToken] = await Promise.all([
            this.generateAccessToken(payload),
            this.generateRefreshToken(payload),
        ]);
        console.log(accessToken, refreshToken);
        return {
            accessToken,
            refreshToken,
            expiresIn: this.configService.get<number>('AccessTokenJwt', 900),
        };
    }

    async generateAccessToken(payload: JwtPayload): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SecretKeyJwt'),
            expiresIn: this.configService.get<string>('AccessTokenJwt', '15m'),
        });
    }

    async generateRefreshToken(payload: JwtPayload): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SecretKeyJwt'),
            expiresIn: this.configService.get<string>('RefreshTokenJwt', '7d'),
        });
    }

    async verifyAccessToken(token: string): Promise<JwtPayload> {
        return await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('SecretKeyJwt'),
        });
    }

    async verifyRefreshToken(token: string): Promise<JwtPayload> {
        return await this.jwtService.verifyAsync(token, {
            secret: this.configService.get<string>('SecretKeyJwt'),
        });
    }
}