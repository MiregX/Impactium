import { BadRequestException, Controller, Get, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';
import { cookieSettings } from './addon/auth.entity';
import { UUID } from 'crypto';
import { ConnectGuard } from './addon/connect.guard';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { User } from '@api/main/user/addon/user.decorator';
import { Cookie } from '../application/addon/cookie.decorator';

@Controller('telegram')
export class TelegramAuthController {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @UseGuards(ConnectGuard)
  @Redirect()
  async login(
    @Res({ passthrough: true }) response: Response,
    @User() user: UserEntity | undefined,
  ) {
    const uuid = crypto.randomUUID();
    if (user) {
      await this.authService.setPayload(uuid, user.uid);
      response.cookie('uuid', uuid, cookieSettings);
    }

    const url = await this.telegramAuthService.getUrl(uuid)
    return { url };
  }

  @Post('callback')
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Cookie('uuid') uuid: UUID,
  ) {
    const authorization = await this.telegramAuthService.callback(uuid);
    response.clearCookie('uuid')
    response.cookie('Authorization', authorization, cookieSettings);
  }
}
