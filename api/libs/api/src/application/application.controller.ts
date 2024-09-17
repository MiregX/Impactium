import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Configuration } from '@impactium/config';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/addon/admin.guard';

@ApiTags('Application')
@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Get('info')
  info() {
    return this.applicationService.info();
  }

  @UseGuards(AdminGuard)
  @Get('toggle/safe')
  toggleSafeMode() {
    return this.applicationService.toggleSafeMode();
  }
  
  @Get('status')
  status() {
    return this.applicationService.status()
  }

  @Cron(CronExpression.EVERY_5_MINUTES) // Production & Always
  handle() { this.applicationService.handle() };
}
