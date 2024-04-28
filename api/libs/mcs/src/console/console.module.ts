import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { Module } from '@nestjs/common';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [
    TelegramModule,
  ],
  controllers: [
    ConsoleController
  ],
  providers: [
    ConsoleService,
  ],
})
export class ConsoleModule {}
