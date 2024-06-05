import { BadRequestException, Controller, Get, Param, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';
import { cookieSettings } from './addon/auth.entity';
import { UUID } from 'crypto';

@Controller('telegram')
export class TelegramAuthController {
  constructor(private readonly telegramAuthService: TelegramAuthService) {}

  @Get('login/:uuid')
  @Redirect()
  async login(@Param('uuid') uuid: UUID) {
    const url = await this.telegramAuthService.getUrl(uuid)
    
    return uuid && url? { url } : BadRequestException;
  }

  @Get('callback/:uuid')
  @Redirect()
  async getCallback(@Param('uuid') uuid: UUID) {
    const authorization = await this.telegramAuthService.callback(uuid);
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback/:uuid')
  async postCallback(
    @Param('uuid') uuid: UUID,
    @Res({ passthrough: true }) response: Response
  ) {
    const authorization = await this.telegramAuthService.callback(uuid);
    response.cookie('Authorization', authorization, cookieSettings);
  }
}
