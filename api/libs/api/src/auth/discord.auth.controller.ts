import { Controller, Get, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { DiscordAuthService } from './discord.auth.service';
import { Id } from '@api/main/user/addon/id.decorator';
import { ConnectGuard } from './addon/connect.guard';
import { AuthService } from './auth.service';
import { Cookie } from '../application/addon/cookie.decorator';
import { UUID } from 'crypto';
import { cookieSettings, λParam } from '@impactium/pattern';
import { AuthMethodController } from './addon/auth.interface';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth <Discord>')
@Controller('discord')
export class DiscordAuthController implements AuthMethodController {
  constructor(
    private readonly discordAuthService: DiscordAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @Redirect()
  @UseGuards(ConnectGuard)
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @Id() uid: λParam.Id | undefined,
  ) {
    const uuid = uid && crypto.randomUUID();
    if (uuid) {
      await this.authService.setPayload(uuid, uid);
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
    const authorization = await this.discordAuthService.callback(code, uuid);
    response.clearCookie('uuid');
    response.cookie('Authorization', authorization, cookieSettings);
    return { url: `${Configuration.getClientLink()}${uuid ? '/account' : ''}` }
  }
}
