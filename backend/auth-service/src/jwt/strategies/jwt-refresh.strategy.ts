import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('SecretKeyJwt', 'default_jwt_refresh_secret'),
            passReqToCallback: true,
            ignoreExpiration: false,
        } as StrategyOptionsWithRequest);
    }

    async validate(req: Request, payload: JwtPayload): Promise<RefreshTokenPayload> {
        const authHeader = req.get('Authorization');
        const refreshToken = authHeader?.replace('Bearer', '').trim();

        return {
            payload: {
                sub: payload.sub,
                username: payload.username,
                email: payload.email
            },
            refreshToken: refreshToken || ''
        };
    }
}