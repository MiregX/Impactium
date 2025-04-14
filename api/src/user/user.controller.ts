import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/addon/auth.guard';
import { Id } from './addon/id.decorator';
import { UserEntity } from './addon/user.entity';
import { UpdateUserDto } from './addon/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from 'src/application/addon/responce.success.decorator';
import { ApiResponseConflict } from 'src/application/addon/response.conflict.decorator';
import { DisplayNameIsSame, UsernameIsSame } from '../application/addon/error';
import { Response } from 'express';
<<<<<<< Updated upstream:api/libs/api/src/user/user.controller.ts
import { λCookie, cookieSettings, λCache } from '@impactium/types';
=======
import { λCookie, cookieSettings, λParam, λCache } from '@impactium/types';
>>>>>>> Stashed changes:api/src/user/user.controller.ts
import { λthrow } from '@impactium/utils';
import { AdminGuard } from '../auth/addon/admin.guard';
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
  ) { }

  @Get('get')
  @UseGuards(AuthGuard)
  @Cache(λCache.UserGet, 15)
  async getUserById(
    @Id() uid: string,
    @Query('logins') logins?: boolean,
  ) {
    const userEntity = await this.userService.findById(uid, { logins });

    if (!userEntity) throw NotFoundException;

    return UserEntity.fromPrisma(userEntity, { logins });
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
    const Authorization = await this.authService.impersonate(uid);

    response.clearCookie(λCookie.Authorization, cookieSettings);
    response.cookie(λCookie.Authorization, Authorization, cookieSettings);
    return Authorization;
  }

  @Patch('edit')
  @UseGuards(AuthGuard)
  @ApiResponseSuccess(UserEntity)
  @ApiResponseConflict()
  async setUsername(
    @Body() body: UpdateUserDto,
    @Id() uid: string
  ) {
    const user = await this.userService.findById(uid);

    if (!user) λthrow(ForbiddenException);

    if (user.username === body.username) λthrow(UsernameIsSame);
    if (user.displayName === body.displayName) λthrow(DisplayNameIsSame);
    return this.userService.update(user.uid, body);
  }

  @Get('admin/is')
  @UseGuards(AuthGuard)
  isAdmin(@Id() uid: string) {
    return uid === 'system';
  }
}
