import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/addon/admin.guard';
import { User } from '../user/addon/user.decorator';
import { UserEntity } from '../user/addon/user.entity';

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

  @Delete('delete/:id')
  @UseGuards(AdminGuard)
  delete(
    @Param('id') id: string,
    @User() user: UserEntity,
  ) {
    return this.tournamentService.delete(user, id);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  checkoutBattleCups() {
    this.tournamentService.insertBattleCups();
  }
};
