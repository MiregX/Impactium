import { Controller, Get } from '@nestjs/common';
import { ConsoleService } from './console.service';

@Controller('console')
export class ConsoleController {
  constructor(private readonly consoleService: ConsoleService) {}
}
