import { Controller, Get, Post, Query, Redirect, Req, Res } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { SteamAuthService } from './steam.auth.service';
import { cookieSettings } from './addon/auth.entity';

@Controller('steam')
export class SteamAuthController {
  constructor(private readonly steamAuthService: SteamAuthService) {}

  @Get('login')
  @Redirect()
  async getUrl() {
    const url = await this.steamAuthService.getUrl()
    return { url };
  }

  @Get('callback')
  @Redirect()
  async getCallback(@Req() request: Request) {
    const authorization = await this.steamAuthService.callback(request)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback')
  async postCallback(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response
  ) {
    const authorization = await this.steamAuthService.callback(request);
    response.cookie('Authorization', authorization, cookieSettings);
  }
}
