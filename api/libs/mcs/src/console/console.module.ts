import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { Module, forwardRef } from '@nestjs/common';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { PlayerModule } from '@api/main/player/player.module';
import { RedisModule } from '@api/main/redis/redis.module';

@Module({
  imports: [
    TelegramModule,
    forwardRef(() => PlayerModule),
    RedisModule,
  ],
  controllers: [
    ConsoleController
  ],
  providers: [
    ConsoleService,
  ],
  exports: [ConsoleService],
})
export class ConsoleModule {}
