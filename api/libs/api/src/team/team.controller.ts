import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, TeamStandarts } from './team.dto';
import { AuthGuard } from '@api/main/auth/auth.guard';
import { User } from '@api/main/user/user.decorator';
import { UserEntity } from '@api/main/user/entities/user.entity';
import { TeamGuard } from './team.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('team')
export class TeamController {
  constructor(
    private readonly teamService: TeamService,
  ) {}

  @Get('get')
  pagination(
    @Query('limit') limit: number = TeamStandarts.DEFAULT_PAGINATION_LIMIT,
    @Query('skip') skip: number = TeamStandarts.DEFAULT_PAGINATION_PAGE,
  ) {
    return this.teamService.pagination(limit, skip);  
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
    @Param('indent') indent: string
  ) {
    return await this.teamService.create({
      uid: user.uid,
      indent: indent
    }, team, banner);
  }

  @Patch('update/:indent')
  @UseGuards(AuthGuard, TeamGuard)
  update(
    @Body() team: CreateTeamDto,
    @User() user: UserEntity,
    @Param('indent') indent: string
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
    @Param('indent') indent: string
  ) {
    return this.teamService.setBanner(indent, banner);
  }
}
