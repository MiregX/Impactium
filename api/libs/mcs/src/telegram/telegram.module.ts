import { TelegramService } from './telegram.service';
import { Module, OnModuleInit } from '@nestjs/common';

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
