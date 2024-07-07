import { Module } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentController } from './tournament.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';

@Module({
  controllers: [TournamentController],
  imports: [PrismaModule],
  providers: [TournamentService],
})
export class TournamentModule {}
