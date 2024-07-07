import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from './addon/user.decorator';
import { UserEntity } from './addon/user.entity';
import { UsernameValidationPipe } from '@api/main/application/addon/username.validator';
import { UpdateUserDisplayNameDto } from './addon/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  async getUserById(
    @User() user: UserEntity,
    @Query() logins: string,
  ) {
    return this.userService.findById(user.uid, {
      ...UserEntity.withLogin(),
      ...UserEntity.withTeams(),
      ...(logins && UserEntity.withLogins()),
    }).then(user => {
      return UserEntity.fromPrisma(user, {
        withTeams: true,
        withLogins: !!logins
      });
    });
  }

  @Post('set/username/:username')
  @UseGuards(AuthGuard)
  setUsername(
    @Param('username', UsernameValidationPipe) username: string,
    @User() user: UserEntity
  ) {
    return this.userService.setUsername(user.uid, username);
  }

  @Post('set/displayname')
  @UseGuards(AuthGuard)
  setDisplayName(
    @Body() { displayName }: UpdateUserDisplayNameDto,
    @User() user: UserEntity
  ) {
    return this.userService.setDisplayName(user.uid, displayName)
  }
}
