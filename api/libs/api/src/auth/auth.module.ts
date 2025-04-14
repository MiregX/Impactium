import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './addon/auth.guard';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { RedisModule } from '@api/main/redis/redis.module';
import { UserModule } from '@api/main/user/user.module';
import { TelegramAuthController } from './telegram.auth.controller';
import { TelegramAuthService } from './telegram.auth.service';
import { SteamAuthController } from './steam.auth.controller';
import { SteamAuthService } from './steam.auth.service';
import { DiscordAuthController } from './discord.auth.controller';
import { DiscordAuthService } from './discord.auth.service';
import { ConnectGuard } from './addon/connect.guard';
import { AdminGuard } from './addon/admin.guard';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'oauth2',
        module: AuthModule,
      },
    ]),
    PrismaModule,
    JwtModule,
    TelegramModule,
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
    ConnectGuard,
    AdminGuard
  ],
  exports: [AuthService, AuthGuard, ConnectGuard, AdminGuard],
})
export class AuthModule {}
