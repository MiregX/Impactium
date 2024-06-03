import { BadRequestException, Controller, Get, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/:uuid')
  @Redirect()
  async getTelegramAuthUrl(@Param('uuid') uuid: string) {
    const url = await this.authService.getTelegramAuthUrl(uuid)
    
    return uuid && url? { url } : BadRequestException;
  }

  @Get('callback/:uuid')
  @Redirect()
  async telegramGetCallback(@Param('uuid') uuid: string) {
    const { authorization } = await this.authService.telegramCallback(uuid);
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback/:uuid')
  async telegramPostCallback(
    @Param('uuid') uuid: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const { authorization, language } = await this.authService.telegramCallback(uuid);
    const settings = {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    }

    response.cookie('Authorization', authorization, settings);
    response.cookie('_language', language, settings);
  }
}
