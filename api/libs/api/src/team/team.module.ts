import { PrismaModule } from '@api/main/prisma/prisma.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule
  ],
  controllers: [
    TeamController
  ],
  providers: [
    TeamService
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}