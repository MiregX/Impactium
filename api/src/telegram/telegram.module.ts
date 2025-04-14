import { RedisModule } from 'src/redis/redis.module';
import { TelegramService } from './telegram.service';
import { Module } from '@nestjs/common';

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
export class TelegramModule { }