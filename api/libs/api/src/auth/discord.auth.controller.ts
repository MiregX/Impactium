import { Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { DiscordAuthService } from './discord.auth.service';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { ConnectGuard } from './addon/connect.guard';
import { AuthService } from './auth.service';
import { Cookie } from '../application/addon/cookie.decorator';
import { UUID } from 'crypto';
import { cookieSettings } from './addon/auth.entity';
import { AuthController } from './addon/auth.interface';
import { Response } from 'express';
@Controller('discord')
export class DiscordAuthController implements AuthController {
  constructor(
    private readonly discordAuthService: DiscordAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Redirect()
  @UseGuards(ConnectGuard)
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @User() user: UserEntity | undefined,
  ) {
    const uuid = user && crypto.randomUUID();
    if (uuid) {
      await this.authService.setPayload(uuid, user.uid);
      response.cookie('uuid', uuid, cookieSettings);
    }

    const url = this.discordAuthService.getUrl()
    return { url };
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
