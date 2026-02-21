export interface JwtPayload {
    sub: string; // user_id
    iat?: number;
    exp?: number;

    username: string;
    email?: string;
    role?: string;
}

export interface JwtPayloadWithRt extends JwtPayload {
    refreshToken?: string;
}

export interface RefreshTokenPayload {
    payload: JwtPayload;
    refreshToken: string;
}