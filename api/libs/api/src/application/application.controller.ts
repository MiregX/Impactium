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
  async status() {
    return await this.applicationService.status().then(_ => {
      console.log(_)
      return _;
    });
  }
}
