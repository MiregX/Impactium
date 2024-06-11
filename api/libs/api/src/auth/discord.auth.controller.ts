import { Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { DiscordAuthService } from './discord.auth.service';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { ConnectGuard } from './addon/connect.guard';
import { AuthService } from './auth.service';
import { Cookie } from '../application/addon/cookie.decorator';
import { UUID } from 'crypto';
import { cookieSettings } from './addon/auth.entity';

@Controller('discord')
export class DiscordAuthController {
  constructor(
    private readonly discordAuthService: DiscordAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Redirect()
  @UseGuards(ConnectGuard)
  async login(
    @Res({ passthrough: true }) response: Response,
    @User() user: UserEntity | undefined,
  ) {
    const uuid = user && crypto.randomUUID();
    if (uuid) {
      await this.authService.setPayload(uuid, user.uid);
      response.cookie('uuid', uuid, cookieSettings);
    }

    return { url: this.discordAuthService.getUrl() };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response,
    @Cookie('uuid') uuid: UUID,
  ) {
    const authorization = await this.discordAuthService.callback(code, uuid)
    response.clearCookie('uuid')
    return uuid ? {
      url: Configuration.getClientLink() + '/account'
    } : {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }
}
