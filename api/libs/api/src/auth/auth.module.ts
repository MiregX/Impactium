import { Module, forwardRef } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './addon/auth.guard';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { RedisModule } from '@api/main/redis/redis.module';
import { UserModule } from '@api/main/user/user.module';
import { TelegramAuthController } from './telegram.auth.controller';
import { TelegramAuthService } from './telegram.auth.service';
import { SteamAuthController } from './steam.auth.controller';
import { SteamAuthService } from './steam.auth.service';
import { DiscordAuthController } from './discord.auth.controller';
import { DiscordAuthService } from './discord.auth.service';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'oauth2',
        module: AuthModule,
      },
    ]),
    TelegramModule,
    PrismaModule,
    JwtModule,
    RedisModule,
    forwardRef(() => UserModule),
  ],
  controllers: [TelegramAuthController, DiscordAuthController, SteamAuthController],
  providers: [
    TelegramAuthService,
    DiscordAuthService,
    SteamAuthService,
    AuthService,
    AuthGuard,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
