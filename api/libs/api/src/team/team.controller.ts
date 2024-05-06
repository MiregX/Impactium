import { Body, Controller, Get, Post, Query, UseGuards, Patch } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './team.dto';
import { AuthGuard } from '@api/main/auth/auth.guard';
import { User } from '@api/main/user/user.decorator';
import { UserEntity } from '@api/main/user/entities/user.entity';
import { TeamGuard } from './team.guard';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('get')
  async getAll(@Query('limit') limit: number, @Query('skip') skip: number) {
    return await this.teamService.pagination(limit, skip);
  }
  
  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() team: CreateTeamDto, @User() user: UserEntity) {
    return await this.teamService.create(user.uid, team);
  }

  @Patch('update')
  @UseGuards(AuthGuard, TeamGuard)
  async update(@Body() team: CreateTeamDto, @User() user: UserEntity) {

  }
}
