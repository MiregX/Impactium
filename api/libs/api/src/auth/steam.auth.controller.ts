import { Controller, Get, Post, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { SteamAuthService } from './steam.auth.service';

@Controller('steam')
export class SteamAuthController {
  constructor(private readonly steamAuthService: SteamAuthService) {}

  @Get('login')
  @Redirect()
  getUrl() {
    return { url: this.steamAuthService.getUrl() };
  }

  @Get('callback')
  @Redirect()
  async getCallback(@Query('code') code: string) {
    const { authorization } = await this.steamAuthService.callback(code)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback')
  async postCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.steamAuthService.callback(code);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
