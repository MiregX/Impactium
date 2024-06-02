import { Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @Redirect()
  async getTelegramAuthUrl() {
    const url = await this.authService.getTelegramAuthUrl()
    return { url };
  }

  @Get('callback')
  @Redirect()
  async telegramGetCallback(@Query('code') uuid: string) {
    const token = await this.authService.telegramCallback(uuid);
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + token
    };
  }

  @Post('callback')
  async telegramPostCallback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.authService.telegramCallback(code);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
