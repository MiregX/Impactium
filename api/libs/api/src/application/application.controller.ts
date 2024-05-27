import { Controller, Get } from '@nestjs/common';
import { ApplicationService } from './application.service';

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
}
