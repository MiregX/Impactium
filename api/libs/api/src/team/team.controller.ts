import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
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
  findOneByIndent(
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.findOneByIndent(indent);
  }

  @Get('find/:value')
  async find(
    @Param('value') value: string
  ) {
    return value.length === 25 || !value.includes(' ')
      ? await this.teamService.findManyByUid(value)
      : await this.teamService.findManyByTitleOrIndent(value)
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
  @UseInterceptors(FileInterceptor('banner', UploadFileDto.getConfig()))
  setBanner(
    @Body() team: UpdateTeamDto,
    @UploadedFile() banner: Express.Multer.File,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.update(indent, team, banner);
  }
}
