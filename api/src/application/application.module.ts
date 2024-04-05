import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Configuration } from '@impactium/config';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
})
export class ApplicationModule {}
