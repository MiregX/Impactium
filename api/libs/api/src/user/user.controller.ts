import { BadRequestException, Body, Controller, ForbiddenException, forwardRef, Get, Inject, NotFoundException, Param, Patch, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from './addon/user.decorator';
import { UserEntity } from './addon/user.entity';
import { FindUserDto, UpdateUserDto } from './addon/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from '@api/main/application/addon/responce.success.decorator';
import { ApiResponseConflict } from '@api/main/application/addon/response.conflict.decorator';
import { DisplayNameIsSame, UsernameIsSame } from '../application/addon/error';
import { createHash, createHmac } from 'crypto';
import { Response } from 'express';
import { λCookie, cookieSettings } from '@impactium/pattern';
import { ApplicationService } from '../application/application.service';
import { λthrow } from '@impactium/utils';
import { AdminGuard } from '../auth/addon/admin.guard';
import { Logger } from '../application/addon/logger.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  async getUserById(
    @User() user: UserEntity,
    @Query('logins') logins?: boolean,
    @Query('teams') teams?: boolean,
  ) {
    const userEntity = await this.userService.findById(user.uid, { teams, logins });

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
    @Param('uid') uid: string,
    @Res({ passthrough: true }) response: Response
  ) {
    const Authorization = await this.userService.impersonate(uid);

    response.clearCookie(λCookie.Authorization, cookieSettings);
    response.cookie(λCookie.Authorization, Authorization, cookieSettings);
    return Authorization;
  }

  @Get('inventory')
  @UseGuards(AuthGuard)
  getInventory(@User() user: UserEntity) {
    return this.userService.inventory(user.uid);
  }

  @Patch('edit')
  @UseGuards(AuthGuard)
  @ApiResponseSuccess(UserEntity)
  @ApiResponseConflict()
  setUsername(
    @Body() body: UpdateUserDto,
    @User() user: UserEntity
  ) {
    if (user.username === body.username) throw new UsernameIsSame();
    if (user.displayName === body.displayName) throw new DisplayNameIsSame()
    return this.userService.update(user.uid, body);
  }

  @Get('admin/is')
  @UseGuards(AuthGuard)
  isAdmin(@User() user: UserEntity) {
    return user.username === 'system'; 
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
