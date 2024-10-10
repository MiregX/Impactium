import { Module } from '@nestjs/common';
import { UsersSeedService } from './api/users.seed';
import { TeamsSeedService } from './api/teams.seed';
import { PrismaModule } from '../../api/src/prisma/prisma.module';
import { TeamMembersSeedService } from './api/teamMembers.seed';
import { TournamentsSeedService } from './api/tournament.seed';

@Module({
  imports: [PrismaModule],
  providers: [UsersSeedService, TeamsSeedService, TeamMembersSeedService, TournamentsSeedService],
  exports: [UsersSeedService, TeamsSeedService, TeamMembersSeedService, TournamentsSeedService],
})
export class SeedModule {
  constructor(
    private readonly usersSeedService: UsersSeedService,
    private readonly teamsSeedService: TeamsSeedService,
    private readonly teamMembersSeedService: TeamMembersSeedService,
    private readonly tournamentsSeedService: TournamentsSeedService,
  ) {}

  async seed() {
    await this.usersSeedService.seed();
    await this.teamsSeedService.seed();
    await this.teamMembersSeedService.seed();
    await this.tournamentsSeedService.seed();
  }
}
