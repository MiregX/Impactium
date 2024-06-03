import { Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { DiscordAuthService } from './discord.auth.service';

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
    const { authorization } = await this.discordAuthService.callback(code)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback')
  async discordPostCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.discordAuthService.callback(code);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
