import { Controller, Get } from '@nestjs/common';
import { ConsoleService } from './console.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('console')
export class ConsoleController {
  constructor(private readonly consoleService: ConsoleService) {}
  
  @Cron(CronExpression.EVERY_10_MINUTES)
  _() {
    this.consoleService.command('list');
  }

  @Get()
  __() {
    return this.consoleService.command('whitelist list')
  }
}
