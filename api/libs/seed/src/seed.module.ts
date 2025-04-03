import { Module } from '@nestjs/common';
import { UsersSeedService } from './api/users.seed';
import { PrismaModule } from '../../api/src/prisma/prisma.module';

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
