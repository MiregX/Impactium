import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, TeamStandarts, UpdateTeamDto } from './addon/team.dto';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TeamGuard } from './addon/team.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { IndentValidationPipe } from '@api/main/application/addon/indent.decorator';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get('get')
  async pagination(
    @Query('limit') limit: number = TeamStandarts.DEFAULT_PAGINATION_LIMIT,
    @Query('skip') skip: number = TeamStandarts.DEFAULT_PAGINATION_PAGE,
  ) {
    const x = await this.teamService.pagination(limit, skip);
    console.table(x);
    return x;
  }

  @Get('get/:indent')
  findOneByIndent(
    @Param('indent') indent: string,
  ) {
    return this.teamService.findOneByIndent(indent);
  }
  
  @Post('create/:indent')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async create(
    @UploadedFile() banner: Express.Multer.File,
    @Body() team: CreateTeamDto,
    @User() user: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return await this.teamService.create({
      uid: user.uid,
      indent: indent
    }, team, banner);
  }

  @Patch('update/:indent')
  @UseGuards(AuthGuard, TeamGuard)
  update(
    @Body() team: UpdateTeamDto,
    @User() user: UserEntity,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.update({
      uid: user.uid,
      indent: indent
    }, team);
  }

  @Patch('set/banner/:indent')
  @UseGuards(AuthGuard, TeamGuard)
  setBanner(
    @UploadedFile() banner: Express.Multer.File,
    @Param('indent', IndentValidationPipe) indent: string
  ) {
    return this.teamService.setBanner(indent, banner);
  }
}
