import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './user.decorator';
import { UserEntity } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('get')
  @UseGuards(AuthGuard)
  getUserById(@User() user: UserEntity) {
    return this.usersService.compareUserWithLogin(user.id)
  }
}
