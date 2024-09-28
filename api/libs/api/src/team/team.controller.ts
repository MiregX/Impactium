import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param, Delete, NotFoundException, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto,  UpdateTeamDto,  UploadFileDto } from './addon/team.dto';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TeamGuard, TeamReadonlyGuard } from './addon/team.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IndentValidationPipe } from '@api/main/application/addon/indent.validator';
import { TeamStandart } from './addon/team.standart';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { λthrow } from '@impactium/utils';
import { UpdateTeamMemberRoleDto } from './addon/team.dto';
import { TeamEntity } from './addon/team.entity';
import { Team } from './addon/team.decorator';
import { TeamMember } from '@prisma/client';
import { ConnectGuard } from '../auth/addon/connect.guard';
import { TeamInviteEntity } from './addon/teamInvite.entity';

@ApiTags('Team')
@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get('get')
  async pagination(
    @Query('limit') limit: number = TeamStandart.DEFAULT_PAGINATION_LIMIT,
    @Query('skip') skip: number = TeamStandart.DEFAULT_PAGINATION_PAGE,
  ) {
      return this.teamService.pagination(limit, skip);
  }

  @Get(':indent/get')
  async findOneByIndent(
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return await this.teamService.findOneByIndent(indent) || λthrow(NotFoundException);
  }

  @Get('find/:value')
  find(
    @Param('value') value: string
  ) {
    return value.length === 25 && !value.includes(' ')
      ? this.teamService.findManyByUid(value)
      : this.teamService.findManyByTitleOrIndent(value);
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
  create(
    @Body() team: CreateTeamDto,
    @User() { uid }: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.create({ uid, indent }, team);
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
  @Put(':indent/set/member-role')
  @UseGuards(TeamGuard)
  async setMemberRole(
    @Body() body: UpdateTeamMemberRoleDto,
    @Team() team: TeamEntity
  ) {
    await this.teamService.setMemberRole(team, body);

    return this.teamService.findOneByIndent(team.indent);
  }

  // Для изгнания участника
  @Delete(':indent/kick/:memberId')
  @UseGuards(TeamGuard)
  async kickMember(
    @Team() team: TeamEntity,
    @Param('memberId') memberId: TeamMember['id']
  ) {
    await this.teamService.kickMember(team, memberId);

    return this.teamService.findOneByIndent(team.indent);
  }

  // Для полученя списка приглашений
  @Get(':indent/invite/list')
  @UseGuards(TeamGuard)
  invites(
    @Team() team: TeamEntity,
  ) {
    return this.teamService.invites(team);
  }

  // Для создания нового приглашения
  @Post(':indent/invite/new')
  @UseGuards(TeamGuard)
  newInvite(
    @Team() team: TeamEntity,
  ) {
    return this.teamService.newInvite(team);
  }

  // Для удаления приглашения
  @Delete(':indent/invite/delete/:id')
  @UseGuards(TeamGuard)
  deleteInvite(
    @Team() team: TeamEntity,
    @Param('id') id: string
  ): Promise<TeamInviteEntity[]> {
    return this.teamService.deleteInvite(team, id);
  }

  // Для проверки приглашения на валидность можно заменить на хеш
  @Get(':indent/invite/check/:id')
  checkInvite(
    @Param('indent') indent: string,
    @Param('id') id: string
  ) {
    return this.teamService.checkInvite(indent, id);
  }

  // ⚠️ NOT RELEASED | Для отклонения приглашения на валидность
  // @Post(':indent/invite/decline/:id')
  // @UseGuards(ConnectGuard)
  // decline(
  //   @Param('indent') indent: string,
  //   @Param('id') id: string,
  //   @User() user: UserEntity | null
  // ) {
  //   if (!user) return;

  //   // Unreleased feature
  //   return this.teamService.declineInvite(indent, id, user.uid);
  // }

  // Для присоенинения к команде
  @Put(':indent/invite/join/:id')
  @UseGuards(AuthGuard, TeamReadonlyGuard)
  acceptInvite(
    @Team() team: TeamEntity,
    @Param('id') id: string,
    @User() user: UserEntity
  ) {
    return this.teamService.acceptInvite(team.indent, id, user.uid)
  }
}
