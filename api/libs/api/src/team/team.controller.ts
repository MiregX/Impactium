import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Patch,
  UploadedFile,
  UseInterceptors,
  Param,
  Delete,
  NotFoundException,
  Put,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto,  UpdateTeamDto,  UploadFileDto } from './addon/team.dto';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TeamExistanseGuard, TeamGuard, TeamMemberGuard } from './addon/team.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IndentValidationPipe } from '@api/main/application/addon/indent.validator';
import { TeamStandart } from './addon/team.standart';
import { ApiTags } from '@nestjs/swagger';
import { λthrow } from '@impactium/utils';
import { UpdateTeamMemberRoleDto } from './addon/team.dto';
import { TeamEntity } from './addon/team.entity';
import { Team } from './addon/team.decorator';
import { Joinable, TeamMember } from '@prisma/client';
import { TeamInviteEntity } from './addon/teamInvite.entity';
import { TeamIsCloseToEveryone } from '../application/addon/error';
import { ConnectGuard } from '../auth/addon/connect.guard';
import { RedisService } from '../redis/redis.service';
import { λCache } from '@impactium/pattern';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
    private readonly redis: RedisService,
  ) {}

  @Get('list')
  async pagination(
    @Query('limit') limit: number = TeamStandart.DEFAULT_PAGINATION_LIMIT,
    @Query('skip') skip: number = TeamStandart.DEFAULT_PAGINATION_PAGE,
  ) {
    const cache = await this.redis.get(λCache.TeamList);

    if (!cache) {
      const teams = await this.teamService.pagination(limit, skip);

      await this.redis.setex(λCache.TeamList, 60, JSON.stringify(teams));

      return teams;
    }

    return JSON.parse(cache); 
  }

  @Get(':indent/get')
  async findOneByIndent(
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    const team = await this.redis.get(`${λCache.TeamIndentGet}:${indent}`);

    if (!team) {
      const team = await this.teamService.findOneByIndent(indent) || λthrow(NotFoundException);

      await this.redis.setex(`${λCache.TeamIndentGet}:${indent}`, 15, JSON.stringify(team));

      return team;
    }

    return team;
  }

  @Get('get')
  @UseGuards(ConnectGuard)
  find(
    @Query() query: Record<string, string>,
    @User() user: UserEntity | null,
  ) {
    if (query.title || query.indent) {
      return this.teamService.findManyByTitleOrIndent(query.title || query.indent)
    } else if (query.uid) {
      return this.teamService.findManyByUid(query.uid)
    } else if (user) {
      return this.teamService.findManyByUid(user.uid)
    }

    λthrow(BadRequestException);
  }
  
  // Для удаления команды
  @Delete(':indent/delete')
  @UseGuards(TeamGuard)
  delete(
    @Param('indent') indent: string,
    @User() user: UserEntity,
  ) {
    return this.teamService.delete(user, indent);
  }

  // Для создания команды
  @Post(':indent/create')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('logo', UploadFileDto.getConfig() as unknown as any))
  create(
    @Body() team: CreateTeamDto,
    @User() { uid }: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string,
    @UploadedFile() logo?: Express.Multer.File,
  ) {
    return this.teamService.create({ uid, indent }, team, logo);
  }

  // Для редактирования команды
  @Patch(':indent/edit')
  @UseGuards(TeamGuard)
  @UseInterceptors(FileInterceptor('logo', UploadFileDto.getConfig() as unknown as any))
  edit(
    @Body() body: UpdateTeamDto,
    @Team() team: TeamEntity,
    @UploadedFile() logo?: Express.Multer.File,
) {
    return this.teamService.update(team, body, logo);
  }

  // Для изменения роли участника
  @Put(':indent/set/role')
  @UseGuards(TeamMemberGuard)
  async setMemberRole(
    @Body() body: UpdateTeamMemberRoleDto,
    @Team() team: TeamEntity,
    @User() user: UserEntity
  ) {
    if (user.uid !== body.uid && user.uid !== team.ownerId) λthrow(ForbiddenException);

    await this.teamService.setMemberRole(team, body);

    return this.teamService.findOneByIndent(team.indent);
  }

  // Для изгнания участника
  @Delete(':indent/kick/:uid')
  @UseGuards(TeamGuard)
  async kickMember(
    @Team() team: TeamEntity,
    @Param('uid') uid: UserEntity['uid']
  ) {
    await this.teamService.kickMember(team, uid);

    return this.teamService.findOneByIndent(team.indent);
  }

  // Для присоединения к команде
  @Post(':indent/join')
  @UseGuards(AuthGuard, TeamExistanseGuard)
  async join(
    @Team() team: TeamEntity,
    @User() user: UserEntity
  ) {
    if (team.joinable !== Joinable.Free) λthrow(TeamIsCloseToEveryone);

    await this.teamService.joinMember(team, user.uid);

    return this.teamService.findOneByIndent(team.indent);
  }

  // Для ухода с команды
  @Delete(':indent/leave')
  @UseGuards(TeamMemberGuard)
  async leave(
    @Team() team: TeamEntity,
    @User() user: UserEntity
  ) {
    await this.teamService.kickMember(team, user.uid);

    return this.teamService.findOneByIndent(team.indent);
  }
}
