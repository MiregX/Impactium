import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from './addon/auth.guard';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserService } from '@api/main/user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('/oauth2', () => {
  let api: INestApplication;
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        AuthGuard,
        PrismaService,
        UserService,
        JwtService,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('/login/discord (GET)', () => {
    const url = `https://discord.com/oauth2/authorize?client_id=1133549843885858926&redirect_uri=${process.env.NODE_ENV !== 'production' ? 'http' : 'https'}%3A%2F%2F${process.env.NODE_ENV !== 'production' ? 'localhost%3A3000' : 'impactium.fun'}%2Flogin%2Fcallback&response_type=code&scope=identify%20guilds`;
    jest.spyOn(authService, 'getDiscordAuthUrl').mockImplementation(() => url);
    expect(authController.getDiscordAuthUrl()).toEqual({ url });
  });

  it('self.register()', () => {
    return authService.register({
      id: 'someIdFromService',
      type: 'discord',
      avatar: 'someAvatarFromService',
      displayName: 'Test User #1',
      lang: 'ru',
      email: 'bot.1@testnet.impactium.fun'
    }).then(result => {
      expect(result).toEqual(expect.objectContaining({
        authorization: expect.stringMatching(/^Bearer\s.+/),
        language: expect.stringMatching(/^[a-zA-Z]{2}$/)
      }));
    });
  });
});
