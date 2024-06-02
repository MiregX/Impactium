import { RedisModule } from '@api/main/redis/redis.module';
import { TelegramService } from './telegram.service';
import { Module, OnModuleInit } from '@nestjs/common';

@Module({
  controllers: [],
  imports: [
    RedisModule
  ],
  providers: [
    TelegramService
  ],
  exports: [
    TelegramService
  ]
})
export class TelegramModule {}
