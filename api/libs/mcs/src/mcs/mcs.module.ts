import { ConsoleModule } from '@api/mcs/console/console.module';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { McsController } from './mcs.controller';
import { McsService } from './mcs.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConsoleModule,
    TelegramModule
  ],
  controllers: [
    McsController
  ],
  providers: [
    McsService
  ],
})
export class McsModule {}
