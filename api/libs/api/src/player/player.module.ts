import { Module, forwardRef } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { PlayerGuard } from './player.guard';
import { ConsoleModule } from '@api/mcs/console/console.module';

@Module({
  controllers: [PlayerController],
  imports: [
    PrismaModule,
    AuthModule,
    forwardRef(() => ConsoleModule)
  ],
  providers: [PlayerService, PlayerGuard],
  exports: [PlayerService],
})
export class PlayerModule {}
