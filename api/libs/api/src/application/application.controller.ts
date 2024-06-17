import { Controller, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('info')
  info() {
    return this.applicationService.info();
  }
  
  @Get('status')
  status() {
    return this.applicationService.status()
  }

  @Cron(CronExpression.EVERY_5_MINUTES) // Production & Always
  // @Cron(CronExpression.EVERY_10_SECONDS) // Development test
  handle() { this.applicationService.handle() };
}
