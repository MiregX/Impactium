import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Configuration } from '@impactium/config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
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

  @Get('debug')
  debug() {
    return !Configuration.isProductionMode() ? (() => { throw new UnauthorizedException() })() : process.env
  }

  @Cron(CronExpression.EVERY_5_MINUTES) // Production & Always
  // @Cron(CronExpression.EVERY_10_SECONDS) // Development test
  handle() { this.applicationService.handle() };
}
