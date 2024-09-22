import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param, Delete, NotFoundException } from '@nestjs/common';
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

  @Get('get/:indent')
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
  
  @Delete('delete/:indent')
  @UseGuards(AdminGuard)
  delete(
    @Param('indent') indent: string,
    @User() user: UserEntity,
  ) {
    return this.teamService.delete(user, indent);
  }

  @Post('create/:indent')
  @UseGuards(AuthGuard)
  async create(
    @Body() team: CreateTeamDto,
    @User() user: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return await this.teamService.create({
      uid: user.uid,
      indent: indent
    }, team);
  }

  @Patch('update/:indent')
  @UseGuards(AuthGuard, TeamGuard)
  @UseInterceptors(FileInterceptor('banner', UploadFileDto.getConfig() as unknown as any))
  setBanner(
    @Body() team: UpdateTeamDto,
    @UploadedFile() banner: Express.Multer.File,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.update(indent, team, banner);
  }
}
