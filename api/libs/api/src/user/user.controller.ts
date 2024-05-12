import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from './addon/user.decorator';
import { UserEntity } from './addon/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  getUserById(@User() user: UserEntity) {
    return this.userService.compareUserWithLogin(user.uid);
  }
}
