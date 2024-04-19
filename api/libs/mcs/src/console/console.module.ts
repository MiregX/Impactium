import { ConsoleController } from './console.controller';
import { ConsoleService } from './console.service';
import { pterosocket } from 'pterosocket';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [
    ConsoleController
  ],
  providers: [
    ConsoleService
  ],
})
export class ConsoleModule {}
