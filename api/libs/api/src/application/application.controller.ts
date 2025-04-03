import { Controller, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) { }

  @Get('info')
  info() {
    return this.applicationService.info();
  }

  @Get('status')
  status() {
    return this.applicationService.status()
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handle() { this.applicationService.handle() };
}
