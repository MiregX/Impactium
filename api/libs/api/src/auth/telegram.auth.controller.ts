import { Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';
import { cookieSettings } from '@impactium/pattern';
import { UUID, createHash, createHmac } from 'crypto';
import { ConnectGuard } from './addon/connect.guard';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { User } from '@api/main/user/addon/user.decorator';
import { Cookie } from '../application/addon/cookie.decorator';
import { AuthMethodController } from './addon/auth.interface';
import { ApiTags } from '@nestjs/swagger';
import { Configuration } from '@impactium/config';
import { JwtService } from '@nestjs/jwt';

@ApiTags('Auth <Telegram>')
@Controller('telegram')
export class TelegramAuthController implements Omit<AuthMethodController, 'getUrl'> {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
  ) {}

  @Get('callback')
  @UseGuards(ConnectGuard)
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query() query: Record<string, string>,
    @User() user: UserEntity,
  ) {
    const isValid = this.telegramAuthService.validate(query);

    if (!isValid) return { url: Configuration.getClientLink(), statusCode: 400 }

    const authorization = await this.telegramAuthService.callback({
      id: query.id,
      type: 'telegram',
      avatar: query.photo_url,
      displayName: query.username || query.first_name,
      uid: user ? user.uid : null
    });

    response.cookie('Authorization', authorization, cookieSettings);
    return { url: Configuration.getClientLink() };
  }
}
