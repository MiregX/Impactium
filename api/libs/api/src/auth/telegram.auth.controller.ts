import { BadRequestException, Controller, Get, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';

@Controller('telegram')
export class TelegramAuthController {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}

  @Get('login/:uuid')
  @Redirect()
  async login(@Param('uuid') uuid: string) {
    const url = await this.telegramAuthService.getUrl(uuid)
    
    return uuid && url? { url } : BadRequestException;
  }

  @Get('callback/:uuid')
  @Redirect()
  async getCallback(@Param('uuid') uuid: string) {
    const { authorization } = await this.telegramAuthService.callback(uuid);
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback/:uuid')
  async postCallback(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.telegramAuthService.callback(uuid);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
