import { convertISOstringToValue } from "@/lib/utils";
import { Grid } from "./Grid.dto";
import { Team } from "./Team.dto";
import { User } from "./User";

export interface Tournament {
  id: string,
  banner: string,
  title: string,
  start: string,
  end: string,
  description: string,
  code: string,
  rules: JSON,
  ownerId: string,
  owner: User,
  teams: Team[],
  gid: string,
  grid: Grid | null,
  comments: Comment[],
  live?: string,
  prize: number
}

export enum TournamentReadyState {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Finished = 'Finished'
}

export const getTournamentReadyState = (tournament: Tournament): TournamentReadyState => convertISOstringToValue(tournament.start) > Date.now()
  ? TournamentReadyState.Upcoming
  : (convertISOstringToValue(tournament.end) > Date.now()
    ? TournamentReadyState.Ongoing
    : TournamentReadyState.Finished);