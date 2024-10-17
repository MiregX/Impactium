import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Delete,
  Put,
  Query,
  Body,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { User } from '@api/main/user/addon/user.decorator';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { TeamExistanseGuard, TeamGuard } from './addon/team.guard';
import { ApiTags } from '@nestjs/swagger';
import { TeamEntity } from './addon/team.entity';
import { Team } from './addon/team.decorator';
import { TeamInviteEntity } from './addon/teamInvite.entity';
import { CreateInviteDto } from './addon/team.dto';
import { λParam } from '@impactium/pattern';

@ApiTags('Invites')
@Controller('team/:indent/invite')
export class TeamInviteController {
  constructor(
    private readonly teamService: TeamService,
  ) {}
  // Для полученя списка приглашений
  @Get('list')
  @UseGuards(TeamGuard)
  invites(
    @Team() team: TeamEntity,
  ) {
    return this.teamService.invites(team);
  }

  // Для создания нового приглашения
  @Post('new')
  @UseGuards(TeamGuard)
  newInvite(
    @Team() team: TeamEntity,
    @Body() invite?: CreateInviteDto,
  ) {
    return this.teamService.newInvite(team, invite?.maxUses);
  }

  // Для удаления приглашения
  @Delete('delete/:id')
  @UseGuards(TeamGuard)
  deleteInvite(
    @Team() team: TeamEntity,
    @Param('id') id: string
  ): Promise<TeamInviteEntity[]> {
    return this.teamService.deleteInvite(team, id);
  }

  // Для проверки приглашения на валидность можно заменить на хеш
  @Get('check/:id')
  checkInvite(
    @Param('indent') indent: λParam.Indent,
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
  @Put('join/:id')
  @UseGuards(AuthGuard, TeamExistanseGuard)
  acceptInvite(
    @Team() team: TeamEntity,
    @Param('id') id: string,
    @User() user: UserEntity
  ) {
    return this.teamService.acceptInvite(team.indent, id, user.uid)
  }
}
