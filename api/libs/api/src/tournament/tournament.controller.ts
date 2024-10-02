import { Controller, Delete, Get, NotFoundException, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { CodeValidationPipe } from '@api/main/application/addon/code.validator';
import { λthrow } from '@impactium/utils';
import { TournamentEntity } from './addon/tournament.entity';
import { TeamGuard } from '../team/addon/team.guard';
import { Team } from '../team/addon/team.decorator';
import { TeamEntity } from '../team/addon/team.entity';
import { TournamentExistanseGuard } from './addon/tournament.guard';
import { Tournament } from './addon/tournament.decorator';

@ApiTags('Tournament')
@Controller('tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get('get')
  findAll(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ) {
    return this.tournamentService.pagination(limit, skip);
  }
  
  @Get(':code/get')
  async findOneByIndent(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code']
  ) {
    return await this.tournamentService.findOneByCode(code) || λthrow(NotFoundException);
  }

  @Delete(':code/delete')
  @UseGuards(AdminGuard)
  delete(
    @Param('code') code: TournamentEntity['code'],
    @User() user: UserEntity,
  ) {
    return this.tournamentService.delete(user, code);
  }

  @Post(':code/join/:indent')
  @UseGuards(TeamGuard, TournamentExistanseGuard)
  join(
    @Team() team: TeamEntity,
    @Tournament() tournament: TournamentEntity
  ) {
    return this.tournamentService.join(tournament, team);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  checkoutBattleCups() {
    this.tournamentService.insertBattleCups();
  }
};
