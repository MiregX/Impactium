import { Team } from "./Team";

export class EditTeamRequest {
  public static create = (team: Partial<Team>) => JSON.stringify(team);
}