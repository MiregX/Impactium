import { Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';

@Controller('discord')
export class DiscordController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }

  @Get('callback')
  @Redirect()
  async discordGetCallback(@Query('code') code: string) {
    const { authorization } = await this.authService.discordCallback(code)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback')
  async discordPostCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.authService.discordCallback(code);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
