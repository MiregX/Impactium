import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { McsController } from './mcs.controller';
import { McsService } from './mcs.service';
import { Module } from '@nestjs/common';
import { FileModule } from '@api/mcs/file/file.module';

@Module({
  imports: [
    TelegramModule,
    FileModule
  ],
  controllers: [
    McsController
  ],
  providers: [
    McsService
  ],
})
export class McsModule {}
