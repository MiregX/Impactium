import { Module } from '@nestjs/common';
import { UsersSeedService } from './api/users.seed';
import { TeamsSeedService } from './api/teams.seed';
import { PrismaModule } from '../../api/src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersSeedService, TeamsSeedService],
  exports: [UsersSeedService, TeamsSeedService],
})
export class SeedModule {
  constructor(
    private readonly usersSeedService: UsersSeedService,
    private readonly teamsSeedService: TeamsSeedService,
  ) {}

  async seed() {
    await this.usersSeedService.seed();
    await this.teamsSeedService.seed();
  }
}
