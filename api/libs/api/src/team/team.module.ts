import { PrismaModule } from '@api/main/prisma/prisma.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { RedisModule } from '@api/main/redis/redis.module';
import { FileModule } from '@api/mcs/file/file.module';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { Module } from '@nestjs/common';
import { TeamInviteController } from './invite.controller';

@Module({
  imports: [
    PrismaModule,
    FileModule,
    AuthModule,
    RedisModule
  ],
  controllers: [
    TeamController,
    TeamInviteController
  ],
  providers: [
    TeamService
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}