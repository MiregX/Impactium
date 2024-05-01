import { TeamService } from './team.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [
    TeamService
  ],
  exports: [
    TeamService
  ]
})
export class TeamModule {}