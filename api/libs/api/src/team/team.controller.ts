import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param, Delete, NotFoundException, Put } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto,  UpdateTeamDto,  UploadFileDto } from './addon/team.dto';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TeamGuard } from './addon/team.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IndentValidationPipe } from '@api/main/application/addon/indent.validator';
import { TeamStandart } from './addon/team.standart';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '@api/main/auth/addon/admin.guard';
import { λthrow } from '@impactium/utils';
import { UpdateTeamMemberRoleDto } from './addon/team.dto';
import { TeamEntity } from './addon/team.entity';
import { Team } from './addon/team.decorator';
import { members } from '@seed/api/assets/teamMembers.data';
import { TeamMember } from '@prisma/client';

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
  
  @Delete(':indent/delete')
  @UseGuards(AdminGuard)
  delete(
    @Param('indent') indent: string,
    @User() user: UserEntity,
  ) {
    return this.teamService.delete(user, indent);
  }

  @Post(':indent/create')
  @UseGuards(AuthGuard)
  create(
    @Body() team: CreateTeamDto,
    @User() { uid }: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.create({ uid, indent }, team);
  }

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

  @Put(':indent/set/member-role')
  @UseGuards(TeamGuard)
  async setMemberRole(
    @Body() body: UpdateTeamMemberRoleDto,
    @Team() team: TeamEntity
  ) {
    await this.teamService.setMemberRole(team, body);

    return this.teamService.findOneByIndent(team.indent);
  }

  @Delete(':indent/kick/:memberId')
  @UseGuards(TeamGuard)
  async kickMember(
    @Team() team: TeamEntity,
    @Param('memberId') memberId: TeamMember['id']
  ) {
    await this.teamService.kickMember(team, memberId);

    return this.teamService.findOneByIndent(team.indent);
  }

  @Get(':indent/qrcode')
  @UseGuards(TeamGuard)
  qrcode(
    @Team() team: TeamEntity,
  ) {
    return this.teamService.newInvite(team);
  }
}
