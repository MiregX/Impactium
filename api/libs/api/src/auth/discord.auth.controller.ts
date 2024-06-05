import { Controller, Get, Param, Post, Query, Redirect, Res } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { DiscordAuthService } from './discord.auth.service';
import { cookieSettings } from './addon/auth.entity';

@Controller('discord')
export class DiscordAuthController {
  constructor(private readonly discordAuthService: DiscordAuthService) {}

  @Get('login')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.discordAuthService.getUrl() };
  }

  @Get('callback')
  @Redirect()
  async discordGetCallback(@Query('code') code: string) {
    const authorization = await this.discordAuthService.callback(code)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback/:code')
  async discordPostCallback(
    @Param('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const authorization = await this.discordAuthService.callback(code);
    response.cookie('Authorization', authorization, cookieSettings);
  }
}
