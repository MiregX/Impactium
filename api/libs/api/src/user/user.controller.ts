import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
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

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  async getUserById(
    @User() user: UserEntity,
    @Query('logins') logins?: string,
    @Query('teams') teams?: string,
  ) {
    const userEntity = await this.userService.findById(user.uid, {
      ...UserEntity.select(),
      ...(teams && UserEntity.withTeams()),
      ...(logins && UserEntity.withLogins()),
    });

    return UserEntity.fromPrisma(userEntity, {
      withTeams: !!teams,
      withLogins: !!logins,
    });
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

  @Get('is-admin')
  @UseGuards(AuthGuard)
  isAdmin(@User() user: UserEntity) {
    return user.username === 'system'; 
  }
}
