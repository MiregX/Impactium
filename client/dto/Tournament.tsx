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
  formats: Format[],
  teams: Team[] | null,
  iterations: Iteration[] | null,
}

export enum TournamentReadyState {
  Upcoming = 'Upcoming',
  Ongoing = 'Ongoing',
  Finished = 'Finished'
}

export type Pair<T = undefined> = [T | undefined , T | undefined];
export type Pairs<T = undefined> = Pair<T>[];

export class λTournament {
  public static pairs = (tournament: Tournament, length: number): Pairs<Team> => Array.from({ length }).map((_, i) => λTournament.iteration(tournament) === length ? λTournament.pair(tournament, i) : [undefined, undefined]);

  public static pair = (tournament: Tournament, i: number): Pair<Team> => [tournament.teams![i * 2], tournament.teams![i * 2 + 1]]

  public static iteration = (tournament: Tournament): number => tournament.formats
    ? Math.max(...tournament.formats.map(format => format.n))
    : 0;

  public static state = (tournament: Tournament): TournamentReadyState => convertISOstringToValue(tournament.start) > Date.now()
    ? TournamentReadyState.Upcoming
    : (convertISOstringToValue(tournament.end) > Date.now()
      ? TournamentReadyState.Ongoing
      : TournamentReadyState.Finished);
}
