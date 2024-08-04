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

@ApiTags('Auth <Telegram>')
@Controller('telegram')
export class TelegramAuthController implements AuthMethodController {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly authService: AuthService,
  ) {}

  @Get('login')
  @UseGuards(ConnectGuard)
  @Redirect()
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @User() user: UserEntity | undefined,
  ) {
    const uuid = crypto.randomUUID();
    response.cookie('uuid', uuid, cookieSettings);
    
    if (user) {
      await this.authService.setPayload(uuid, user.uid);
    }

    const url = await this.telegramAuthService.getUrl(uuid)
    return { url };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query() query: Record<string, string>,
    @Cookie('uuid') uuid: UUID,
  ) {
    const isValid = this.telegramAuthService.validate(query);

    if (!isValid) return { url: Configuration.getClientLink(), statusCode: 400 }

    const authorization = await this.telegramAuthService.callback({
      id: query.id,
      type: 'telegram',
      avatar: query.photo_url,
      displayName: query.username || query.first_name,
    }, uuid);
    
    response.clearCookie('uuid')
    response.cookie('Authorization', authorization, cookieSettings);
    return { url: Configuration.getClientLink() };
  }
}
