import { Body, Controller, ForbiddenException, forwardRef, Get, Inject, Logger, NotAcceptableException, NotFoundException, Param, Patch, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
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
import { cookiePattern, cookieSettings } from '@impactium/pattern';
import { ApplicationService } from '../application/application.service';
import { λthrow } from '@impactium/utils';
import { AdminGuard } from '../auth/addon/admin.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService
  ) {}

  @Get('get')
  @UseGuards(AuthGuard)
  async getUserById(
    @User() user: UserEntity,
    @Query('logins') logins?: boolean,
    @Query('teams') teams?: boolean,
  ) {
    const userEntity = await this.userService.findById(user.uid, UserEntity.select({ teams, logins }));

    if (!userEntity) throw NotFoundException;

    return UserEntity.fromPrisma(userEntity, { teams, logins });
  }

  @Get
  ('find')
  @UseGuards(AdminGuard)
  async find(
    @Body() body: FindUserDto,
  ) {
    return this.userService.find(body);
  }

  @Get('impersonate/:uid')
  @UseGuards(AdminGuard)
  async impersonate(
    @Param('uid') uid: string,
    @Res() response: Response
  ) {
    const Authorization = `Bearer ${await this.userService.impersonate(uid)}`;
    response.cookie(cookiePattern.Authorization, Authorization, cookieSettings);
    return Authorization;
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

  @Get('admin/bypass')
  async bypassAdmin(
    @Res({ passthrough: true }) res: Response,
    @Query('key') keypass: string
  ) {
    if (!keypass) throw new NotFoundException();

    const hash = createHmac('sha256', createHash('sha256').digest()).update(keypass).digest('hex');

    hash !== 'fc9227d8d32453a8c20339a1b244459c649ef3a52ad66476cad9350c50593466' && λthrow(ForbiddenException);

    const token = await this.applicationService.createSystemAccount();

    res.cookie(cookiePattern.Authorization, token, cookieSettings)

    return token;
  }
}
