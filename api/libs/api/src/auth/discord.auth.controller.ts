import { Controller, Get, Param, Post, Query, Redirect, Res, UseGuards } from '@nestjs/common';
import { Configuration } from '@impactium/config';
import { Response } from 'express';
import { DiscordAuthService } from './discord.auth.service';
import { cookieSettings } from './addon/auth.entity';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { ConnectGuard } from './addon/connect.guard';
import { UUID } from 'crypto';

@Controller('discord')
export class DiscordAuthController {
  constructor(private readonly discordAuthService: DiscordAuthService) {}

  @Get('login')
  @Redirect()
  @UseGuards(ConnectGuard)
  async getDiscordAuthUrl(@User() user: UserEntity) {
    const url = await this.discordAuthService.getUrl(user?.uid);
    console.log(url);
    return { url };
  }

  @Get('callback')
  @Redirect()
  async discordGetCallback(
    @Query('code') code: string,
    @Query('uuid') uuid?: UUID,
  ) {
    const authorization = await this.discordAuthService.callback(code, uuid)
    return {
      url: Configuration.getClientLink() + '/login/callback?token=' + authorization
    };
  }

  @Post('callback/:code')
  async discordPostCallback(
    @Param('code') code: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const authorization = await this.discordAuthService.callback(code);
    response.cookie('Authorization', authorization, cookieSettings);
  }
}
