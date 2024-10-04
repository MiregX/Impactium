import { convertISOstringToValue } from "@/lib/utils";
import { Team } from "./Team.dto";
import { User } from "./User";
import { Format } from "./Format.dto";
import { Iteration } from "./Iteration.dto";

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
  prize: number,
  live: string | null,
  createdAt: number,
  has_lower_bracket: boolean,
  owner: User | null,
  formats: Format[] | null,
  teams: Team[] | null,
  iterations: Iteration[] | null,
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

export const getBiggestIteration = (tournament: Tournament): number => tournament.formats
  ? Math.max(...tournament.formats.map(format => format.n))
  : 0
