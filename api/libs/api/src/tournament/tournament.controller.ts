import { Body, Controller, Delete, Get, NotFoundException, OnModuleInit, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TournamentEntity } from './addon/tournament.entity';
import { TeamGuard } from '../team/addon/team.guard';
import { Team } from '../team/addon/team.decorator';
import { TeamEntity } from '../team/addon/team.entity';
import { TournamentExistanseGuard } from './addon/tournament.guard';
import { Tournament } from './addon/tournament.decorator';
import { RedisService } from '../redis/redis.service';
import { λCache } from '@impactium/pattern';
import { Cache, Recache } from '../application/addon/cache.decorator';
import { AuthGuard } from '../auth/addon/auth.guard';
import { CreateTournamentDto, UpdateTournamentDto } from './addon/tournament.dto';
import { ImageValidator } from '../application/addon/image.validator';
import { CodeValidationPipe } from './addon/code.validator';

@ApiTags('Tournament')
@Controller('tournament')
export class TournamentController implements OnModuleInit {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly redis: RedisService
  ) {}

  onModuleInit = () => this.scheduler();
  
  @Cron(CronExpression.EVERY_HOUR)
  async scheduler() {
    await this.tournamentService.scheduler();
  }

  @Get('get')
  findAll(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ) {
    return this.tournamentService.pagination(limit, skip);
  }
  
  @Get(':code/get')
  @Cache(λCache.TournamentCodeGet, 60)
  async findOneByIndent(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code'],
  ) {
    return await this.tournamentService.find(code);
  }

  @Delete(':code/delete')
  @UseGuards(AdminGuard)
  delete(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code'],
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
  
  @Post('create')
  @UseGuards(AuthGuard)
  @ImageValidator('banner')
  create(
    @Body() tournament: CreateTournamentDto,
    @User() { uid }: UserEntity,
    @UploadedFile() banner: Express.Multer.File,
  ) {
    return this.tournamentService.create(uid, tournament, banner);
  }

  @Post(':code/generate-iteration')
  @UseGuards(AdminGuard, TournamentExistanseGuard)
  @Recache(λCache.TournamentCodeGet)
  generateIteration(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code'],
  ) {
    console.log(code);
    return this.tournamentService.generateIteration(code);
  }

  @Post(':code/insert-team')
  @UseGuards(AdminGuard, TournamentExistanseGuard)
  @Recache(λCache.TournamentCodeGet)
  insertTeam(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code'],
  ) {
    return this.tournamentService.insertTeam(code);
  }

  @Post(':code/process-iteration')
  @UseGuards(AdminGuard, TournamentExistanseGuard)
  processIteration(
    @Param('code', CodeValidationPipe) code: TournamentEntity['code'],
  ) {
    return this.tournamentService.processIteration(code);
  }

  @Put(':code/update')
  @UseGuards(AuthGuard)
  @ImageValidator('banner')
  update(
    @Body() tournament: UpdateTournamentDto,
    @User() { uid }: UserEntity,
    @UploadedFile() banner?: Express.Multer.File,
  ) {
    return this.tournamentService.update(uid, tournament, banner);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  checkoutBattleCups() {
    this.tournamentService.insertBattleCups();
  }
};
