import { Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';

@Controller('oauth2')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('callback/discord')
  @Redirect()
  async discordGetCallback(@Query('code') code: string) {
    const token = await this.authService.discordCallback(code)
    return { url: Configuration.getClientLink() + '/login/callback?token=' + token };
  }

  @Post('callback/discord')
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

  @Get('login/discord')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }
}
