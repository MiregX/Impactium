import { BadRequestException, Body, Controller, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Patch, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { Id } from './addon/id.decorator';
import { UserEntity } from './addon/user.entity';
import { UpdateUserDto } from './addon/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from '@api/main/application/addon/responce.success.decorator';
import { ApiResponseConflict } from '@api/main/application/addon/response.conflict.decorator';
import { DisplayNameIsSame, UsernameIsSame } from '../application/addon/error';
import { Response } from 'express';
import { λCookie, cookieSettings, λParam, λCache } from '@impactium/pattern';
import { λthrow } from '@impactium/utils';
import { AdminGuard } from '../auth/addon/admin.guard';
import { Logger } from '../application/addon/logger.service';
import { AuthService } from '../auth/auth.service';
import { Cache } from '../application/addon/cache.decorator';
import { RedisService } from '../redis/redis.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redis: RedisService,
  ) {}

  @Get('get')
  @UseGuards(AuthGuard)
  @Cache(λCache.UserGet, 15)
  async getUserById(
    @Id() uid: λParam.Id,
    @Query('logins') logins?: boolean,
    @Query('teams') teams?: boolean,
  ) {
    const userEntity = await this.userService.findById(uid, { teams, logins });

    if (!userEntity) throw NotFoundException;

    return UserEntity.fromPrisma(userEntity, { teams, logins });
  }

  @Get('find')
  @UseGuards(AdminGuard)
  find(
    @Query('search') search: string,
  ) {
    return this.userService.find(search);
  }

  @Get('impersonate/:uid')
  @UseGuards(AdminGuard)
  async impersonate(
    @Param('uid') uid: λParam.Id,
    @Res({ passthrough: true }) response: Response
  ) {
    const Authorization = await this.authService.impersonate(uid);

    response.clearCookie(λCookie.Authorization, cookieSettings);
    response.cookie(λCookie.Authorization, Authorization, cookieSettings);
    return Authorization;
  }

  @Get('inventory')
  @UseGuards(AuthGuard)
  getInventory(@Id() uid: λParam.Id) {
    return this.userService.inventory(uid);
  }

  @Patch('edit')
  @UseGuards(AuthGuard)
  @ApiResponseSuccess(UserEntity)
  @ApiResponseConflict()
  async setUsername(
    @Body() body: UpdateUserDto,
    @Id() uid: λParam.Id
  ) {
    const user = await this.userService.findById(uid);

    if (!user) λthrow(ForbiddenException);

    if (user.username === body.username) λthrow(UsernameIsSame);
    if (user.displayName === body.displayName) λthrow(DisplayNameIsSame);
    return this.userService.update(user.uid, body);
  }

  @Get('admin/is')
  @UseGuards(AuthGuard)
  isAdmin(@Id() uid: λParam.Id) {
    return uid === 'system'; 
  }

  @Get('admin')
  async bypassAdmin(
    @Res({ passthrough: true }) res: Response,
    @Query('key') keypass: string
  ) {
    if (!keypass) {
      Logger.warn('Someone is requested /user/admin', UserController.name);
      λthrow(BadRequestException)
    };

    const token = await this.userService.admin(keypass);

    res.cookie(λCookie.Authorization, token, cookieSettings)

    return token;
  }
}
