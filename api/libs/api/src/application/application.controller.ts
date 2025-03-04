import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from '../auth/addon/admin.guard';
import { Cache } from './addon/cache.decorator';
import { HOUR, λCache } from '@impactium/pattern';
import { GrpcMethod } from '@nestjs/microservices';

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

  @Get('blueprints')
  blueprints() {
    return this.applicationService.getBlueprints();
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  handle() { this.applicationService.handle() };
}
