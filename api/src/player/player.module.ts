import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { PlayerGuard } from './player.guard';

@Module({
  controllers: [PlayerController],
  imports: [PrismaModule, AuthModule],
  providers: [PlayerService, PlayerGuard],
})
export class PlayerModule {}
