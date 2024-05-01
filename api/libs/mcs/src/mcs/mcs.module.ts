import { ConsoleModule } from '@api/mcs/console/console.module';
import { TelegramModule } from '@api/mcs/telegram/telegram.module';
import { McsController } from './mcs.controller';
import { McsService } from './mcs.service';
import { Module } from '@nestjs/common';
import { SFTPModule } from '@api/mcs/sftp/sftp.module';

@Module({
  imports: [
    TelegramModule,
    SFTPModule
  ],
  controllers: [
    McsController
  ],
  providers: [
    McsService
  ],
})
export class McsModule {}
