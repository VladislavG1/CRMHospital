import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        @Inject('REDIS_CLIENT') private readonly redis: Redis
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('SecretKeyJwt', 'default_jwt_secret'),
        });
    }

    async validate(payload: JwtPayload): Promise<any> {
        const blacklistedAt = await this.redis.get(`blacklist:${payload.sub}`)

        if (blacklistedAt) {
            const tokenIssuedAt = payload.iat * 1000;
            if (tokenIssuedAt < parseInt(blacklistedAt)) {
                throw new UnauthorizedException('Роль изменена, необходима повторная авторизация');
            }
        }

        return {
            id: payload.sub,
            username: payload.username,
            email: payload.email,
            role: payload.role
        };
    }
}