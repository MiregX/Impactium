import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { AuthModule } from '@api/main/auth/auth.module';

@Module({
  controllers: [TournamentController],
  imports: [PrismaModule, AuthModule],
  providers: [TournamentService],
})
export class TournamentModule {}
