<<<<<<< Updated upstream:api/libs/api/src/auth/telegram.auth.controller.ts
import { Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';
import { λCookie, cookieSettings } from '@impactium/types';
import { UUID } from 'crypto';
import { ConnectGuard } from './addon/connect.guard';
import { Id } from '@api/main/user/addon/id.decorator';
import { Cookie } from '../application/addon/cookie.decorator';
import { AuthMethodController } from './addon/auth.interface';
import { ApiTags } from '@nestjs/swagger';
import { Configuration } from 'src/configuration';

@ApiTags('Auth <Telegram>')
@Controller('telegram')
export class TelegramAuthController implements Omit<AuthMethodController, 'getUrl'> {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly authService: AuthService,
  ) { }

  @Get('login')
  @UseGuards(ConnectGuard)
  @Redirect()
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @Id() uid: string | undefined,
  ) {
    const uuid = crypto.randomUUID();
    response.cookie('uuid', uuid, cookieSettings);

    if (uid) {
      await this.authService.setPayload(uuid, uid);
    }

    const url = await this.telegramAuthService.getUrl(uuid)
    return { url };
  }

  @Get('callback')
  @UseGuards(ConnectGuard)
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query() query: Record<string, string> = {},
    @Cookie('uuid') uuid: UUID | undefined,
    @Id() uid: string | undefined,
  ) {
    const isValid = query ? this.telegramAuthService.validate(query) : true;

    if (!isValid) return { url: Configuration.link(), statusCode: 400 }

    const authorization = await this.telegramAuthService.callback({
      id: query.id,
      type: 'telegram',
      avatar: query.photo_url,
      displayName: query.username || query.first_name,
      uid
    }, uuid);

    response.clearCookie('uuid')
    response.cookie(λCookie.Authorization, authorization, cookieSettings);
    return { url: Configuration.link() };
  }

  @Post('callback')
  @UseGuards(ConnectGuard)
  async pastCallback(
    @Res({ passthrough: true }) response: Response,
    @Cookie('uuid') uuid: UUID | null,
    @Id() uid?: string,
  ) {
    if (!uuid) return { url: Configuration.link }
    const authorization = await this.telegramAuthService.postCallback(uuid, uid);

    response.clearCookie('uuid')
    response.cookie(λCookie.Authorization, authorization, cookieSettings);
    return authorization;
  }
}
=======
import { Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { TelegramAuthService } from './telegram.auth.service';
import { λCookie, cookieSettings, λParam } from '@impactium/types';
import { UUID } from 'crypto';
import { ConnectGuard } from './addon/connect.guard';
import { Id } from 'src/user/addon/id.decorator';
import { Cookie } from '../application/addon/cookie.decorator';
import { AuthMethodController } from './addon/auth.interface';
import { ApiTags } from '@nestjs/swagger';
import { Configuration } from 'src/configurator';

@ApiTags('Auth <Telegram>')
@Controller('telegram')
export class TelegramAuthController implements Omit<AuthMethodController, 'getUrl'> {
  constructor(
    private readonly telegramAuthService: TelegramAuthService,
    private readonly authService: AuthService,
  ) { }

  @Get('login')
  @UseGuards(ConnectGuard)
  @Redirect()
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @Id() uid: λParam.Id | undefined,
  ) {
    const uuid = crypto.randomUUID();
    response.cookie('uuid', uuid, cookieSettings);

    if (uid) {
      await this.authService.setPayload(uuid, uid);
    }

    const url = await this.telegramAuthService.getUrl(uuid)
    return { url };
  }

  @Get('callback')
  @UseGuards(ConnectGuard)
  @Redirect()
  async callback(
    @Res({ passthrough: true }) response: Response,
    @Query() query: Record<string, string> = {},
    @Cookie('uuid') uuid: UUID | undefined,
    @Id() uid: λParam.Id | undefined,
  ) {
    const isValid = query ? this.telegramAuthService.validate(query) : true;

    if (!isValid) return { url: Configuration.link, statusCode: 400 }

    const authorization = await this.telegramAuthService.callback({
      id: query.id,
      type: 'telegram',
      avatar: query.photo_url,
      displayName: query.username || query.first_name,
      uid
    }, uuid);

    response.clearCookie('uuid')
    response.cookie(λCookie.Authorization, authorization, cookieSettings);
    return { url: Configuration.link };
  }

  @Post('callback')
  @UseGuards(ConnectGuard)
  async pastCallback(
    @Res({ passthrough: true }) response: Response,
    @Cookie('uuid') uuid: UUID | null,
    @Id() uid?: λParam.Id,
  ) {
    if (!uuid) return { url: Configuration.link }
    const authorization = await this.telegramAuthService.postCallback(uuid, uid);

    response.clearCookie('uuid')
    response.cookie(λCookie.Authorization, authorization, cookieSettings);
    return authorization;
  }
}
>>>>>>> Stashed changes:api/src/auth/telegram.auth.controller.ts
