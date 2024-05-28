import { Module } from '@nestjs/common';
import { UsersSeedService } from './api/users.seed';
import { TeamsSeedService } from './api/teams.seed';
import { PrismaModule } from '../../api/src/prisma/prisma.module';
import { ChangelogsSeedService } from './api/changelog.seed';

@Module({
  imports: [PrismaModule],
  providers: [UsersSeedService, TeamsSeedService, ChangelogsSeedService],
  exports: [UsersSeedService, TeamsSeedService, ChangelogsSeedService],
})
export class SeedModule {
  constructor(
    private readonly usersSeedService: UsersSeedService,
    private readonly teamsSeedService: TeamsSeedService,
    private readonly changelogSeedService: ChangelogsSeedService,
  ) {}

  async seed() {
    await this.usersSeedService.seed();
    await this.teamsSeedService.seed();
    await this.changelogSeedService.seed();
  }
}
