import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { PlayerGuard } from './player.guard';

@Module({
  controllers: [PlayerController],
  imports: [PrismaModule, AuthModule],
  providers: [PlayerService, PlayerGuard],
})
export class PlayerModule {}
