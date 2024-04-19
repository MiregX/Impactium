import { ConsoleModule } from '@api/mcs/console/console.module';
import { McsController } from './mcs.controller';
import { McsService } from './mcs.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConsoleModule
  ],
  controllers: [
    McsController
  ],
  providers: [
    McsService
  ],
})
export class McsModule {}
