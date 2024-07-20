import { Controller, Get, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response, Request } from 'express';
import { SteamAuthService } from './steam.auth.service';
import { cookieSettings } from '@impactium/pattern';
import { User } from '../user/addon/user.decorator';
import { UserEntity } from '../user/addon/user.entity';
import { AuthService } from './auth.service';
import { ConnectGuard } from './addon/connect.guard';
import { Cookie } from '../application/addon/cookie.decorator';
import { UUID } from 'crypto';
import { AuthMethodController } from './addon/auth.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth <Steam>')
@Controller('steam')
export class SteamAuthController implements AuthMethodController {
  constructor(
    private readonly steamAuthService: SteamAuthService,
    private readonly authService: AuthService
  ) {}

  @Get('login')
  @UseGuards(ConnectGuard)
  @Redirect()
  async getUrl(
    @Res({ passthrough: true }) response: Response,
    @User() user: UserEntity | undefined,
  ) {
    const uuid = user && crypto.randomUUID();
    if (uuid) {
      await this.authService.setPayload(uuid, user.uid);
      response.cookie('uuid', uuid, cookieSettings);
    }

    const url = await this.steamAuthService.getUrl()
    return { url };
  }

  @Get('callback')
  @Redirect()
  async callback(
    @Cookie('uuid') uuid: string,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authorization = await this.steamAuthService.callback(request, uuid);
    response.clearCookie('uuid')
    response.cookie('Authorization', authorization, cookieSettings);

    return { url: Configuration.getClientLink() + '/account' };
  }
}
