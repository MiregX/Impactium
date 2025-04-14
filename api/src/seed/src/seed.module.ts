import { Module } from '@nestjs/common';
import { UsersSeedService } from './api/users.seed';
import { PrismaModule } from '../../prism/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersSeedService],
  exports: [UsersSeedService],
})
export class SeedModule {
  constructor(
    private readonly usersSeedService: UsersSeedService,
  ) { }

  async seed() {
    await this.usersSeedService.seed();
  }
}
