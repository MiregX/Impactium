import { TelegramService } from './telegram.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  imports: [],
  providers: [
    TelegramService
  ],
  exports: [
    TelegramService
  ]
})
export class TelegramModule {}
