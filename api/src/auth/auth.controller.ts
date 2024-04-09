import { Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import passport from 'passport';
import { Configuration } from '@impactium/config';
import { FastifyReply } from 'fastify';

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
    @Res({ passthrough: true }) response: FastifyReply
  ) {
    const { authorization, language } = await this.authService.discordCallback(code);
    const settings = {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      path: '/'
    }

    response.setCookie('Authorization', authorization, settings);
    response.setCookie('_language', language, settings);
  }

  @Get('login/discord')
  @Redirect()
  getDiscordAuthUrl() {
    return { url: this.authService.getDiscordAuthUrl() };
  }
}
