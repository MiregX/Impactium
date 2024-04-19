import { McsController } from './mcs.controller';
import { McsService } from './mcs.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [
    McsController
  ],
  providers: [
    McsService
  ],
})
export class McsModule {}
