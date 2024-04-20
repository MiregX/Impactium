import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [
    TelegramController
  ],
  providers: [
    TelegramService
  ],
  exports: [
    TelegramService
  ]
})
export class TelegramModule {}
