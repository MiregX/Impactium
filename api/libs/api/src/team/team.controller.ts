import { Body, Controller, Get, Post, Query, UseGuards, Patch, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto } from './team.dto';
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
  async getAll(@Query('limit') limit: number, @Query('skip') skip: number) {
    return await this.teamService.pagination(limit, skip);
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
  async update(
    @UploadedFile() banner: Express.Multer.File,
    @Body() team: CreateTeamDto,
    @User() user: UserEntity,
    @Param('indent') indent: string
  ) {
    return await this.teamService.update({
      uid: user.uid,
      indent: indent
    }, team, banner);
  }
}
