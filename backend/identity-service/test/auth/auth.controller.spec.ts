import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
    let controller: AuthController;
    let authServiceMock: Partial<AuthService>;

    beforeEach(async () => {
        authServiceMock = {
            getSalt: jest.fn(),
            login: jest.fn(),
            register: jest.fn(),
            refreshTokens: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: authServiceMock }],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('getSalt вызывает сервис с переданным login', async () => {
        (authServiceMock.getSalt as jest.Mock).mockResolvedValue({ password_salt: 's' });
        const res = await controller.getSalt({ login: 'user' } as any);
        expect(authServiceMock.getSalt).toHaveBeenCalledWith('user');
        expect(res).toEqual({ password_salt: 's' });
    });

    it('login вызывает сервис с login и password_hash', async () => {
        (authServiceMock.login as jest.Mock).mockResolvedValue({ accessToken: 'a' });
        const res = await controller.login({ login: 'u', password_hash: 'h' } as any);
        expect(authServiceMock.login).toHaveBeenCalledWith('u', 'h');
        expect(res).toEqual({ accessToken: 'a' });
    });

    it('register вызывает сервис с DTO', async () => {
        (authServiceMock.register as jest.Mock).mockResolvedValue({ id: 1 });
        const dto = { username: 'u', email: 'e', password: 'p' } as any;
        const res = await controller.register(dto);
        expect(authServiceMock.register).toHaveBeenCalledWith(dto);
        expect(res).toEqual({ id: 1 });
    });
});
