import { Controller, Get } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('console')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

}
