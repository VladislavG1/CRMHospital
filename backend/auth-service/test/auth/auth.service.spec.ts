import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtAuthService } from '../../src/jwt/jwt.service';
import { PrismaService } from '../../src/prisma.service';
import { NotFoundException, UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
    let service: AuthService;

    let findFirstMock: jest.Mock;
    let createMock: jest.Mock;

    let verifyRefreshTokenMock: jest.Mock;
    let generateTokenPairMock: jest.Mock;

    let prismaMock: any;
    let jwtMock: any;

    beforeEach(async () => {
        findFirstMock = jest.fn();
        createMock = jest.fn();

        verifyRefreshTokenMock = jest.fn();
        generateTokenPairMock = jest.fn();

        prismaMock = {
            mainUser: {
                findFirst: findFirstMock,
                create: createMock,
            },
        };

        jwtMock = {
            verifyRefreshToken: verifyRefreshTokenMock,
            generateTokenPair: generateTokenPairMock,
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: PrismaService, useValue: prismaMock },
                { provide: JwtAuthService, useValue: jwtMock },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    describe('getSalt', () => {
        it('возвращает password_salt если пользователь найден', async () => {
            findFirstMock.mockResolvedValueOnce({ password_salt: 'somesalt' });

            const res = await service.getSalt('some-login');
            expect(res).toEqual({ password_salt: 'somesalt' });
            expect(findFirstMock).toHaveBeenCalled();
        });

        it('кидает NotFoundException если пользователь не найден или нет auth', async () => {
            findFirstMock.mockResolvedValueOnce(null);
            await expect(service.getSalt('noone')).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('timingSafeEqualStr', () => {
        it('возвращает false для не-строк или null', () => {
            // @ts-ignore
            expect((service as any).timingSafeEqualStr(123, 'abc')).toBe(false);
            // @ts-ignore
            expect((service as any).timingSafeEqualStr('a', null)).toBe(false);
        });

        it('возвращает false для строк разной длины', () => {
            // @ts-ignore
            expect((service as any).timingSafeEqualStr('abc', 'ab')).toBe(false);
        });

        it('возвращает true для одинаковых строк', () => {
            // @ts-ignore
            expect((service as any).timingSafeEqualStr('same-string', 'same-string')).toBe(true);
        });
    });

    describe('login', () => {
        it('кидает UnauthorizedException когда пользователь не найден', async () => {
            findFirstMock.mockResolvedValueOnce(null);
            await expect(service.login('user', 'hash')).rejects.toBeInstanceOf(UnauthorizedException);
        });

        it('кидает UnauthorizedException когда пароль не совпадает', async () => {
            findFirstMock.mockResolvedValueOnce({ password_hash: 'storedhash' });
            await expect(service.login('user', 'different')).rejects.toBeInstanceOf(UnauthorizedException);
        });

        it('возвращает токен-пару когда пароль совпадает', async () => {
            const tokens = { accessToken: 'a', refreshToken: 'r' };
            findFirstMock.mockResolvedValueOnce({
                id: 1,
                username: 'u',
                email: 'e',
                password_hash: 'match',
            });

            jest.spyOn<any, any>(service as any, 'timingSafeEqualStr').mockReturnValueOnce(true);
            generateTokenPairMock.mockResolvedValueOnce(tokens);

            const res = await service.login('u', 'match');
            expect(res).toBe(tokens);
            expect(generateTokenPairMock).toHaveBeenCalled();
        });
    });

    describe('refreshTokens', () => {
        it('верифицирует refresh token и генерирует новую пару', async () => {
            const payload = { sub: 1, username: 'u', email: 'e' };
            verifyRefreshTokenMock.mockResolvedValueOnce(payload);
            generateTokenPairMock.mockResolvedValueOnce({ accessToken: 'a', refreshToken: 'r' });

            const res = await service.refreshTokens('rtoken');
            expect(res).toEqual({ accessToken: 'a', refreshToken: 'r' });
            expect(verifyRefreshTokenMock).toHaveBeenCalledWith('rtoken');
        });
    });

    describe('register', () => {
        it('кидает ConflictException если пользователь уже существует', async () => {
            findFirstMock.mockResolvedValueOnce({ id: 1 });
            await expect(
                service.register({ username: 'u', email: 'e', password: 'p' } as any),
            ).rejects.toBeInstanceOf(ConflictException);
        });

        it('создаёт пользователя и возвращает пользователя + токены', async () => {
            findFirstMock.mockResolvedValueOnce(null);

            const createdUser = { id: 2, username: 'u', email: 'e' };
            createMock.mockResolvedValueOnce(createdUser);

            generateTokenPairMock.mockResolvedValueOnce({ accessToken: 'a', refreshToken: 'r' });

            const dto = { username: 'u', email: 'e', password: 'password', firstName: 'F', lastName: 'L' };
            const res = await service.register(dto as any);

            expect(createMock).toHaveBeenCalled();
            expect(generateTokenPairMock).toHaveBeenCalled();
            expect(res).toMatchObject({ id: 2, username: 'u', email: 'e', accessToken: 'a', refreshToken: 'r' });
        });
    });
});
