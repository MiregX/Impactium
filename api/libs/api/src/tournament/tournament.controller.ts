import { Controller, Delete, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { CodeValidationPipe } from '@api/main/application/addon/code.validator';
import { λthrow } from '@impactium/utils';

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
  
  @Get('get/:code')
  async findOneByIndent(
    @Param('code', CodeValidationPipe) code: string
  ) {
    return await this.tournamentService.findOneByCode(code) || λthrow(NotFoundException);
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
