import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AuthService } from './auth.service';
import { TelegramController } from './telegram.auth.controller';
import { DiscordController } from './discord.auth.controller';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserService } from '@api/main/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './addon/auth.guard';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'oauth2',
        module: AuthModule,
      },
    ]),
    TelegramModule
  ],
  controllers: [TelegramController, DiscordController],
  providers: [
    AuthService,
    AuthGuard,
    PrismaService,
    UserService,
    JwtService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
