import { convertISOstringToValue } from "@/lib/utils";
import { Team } from "./Team.dto";
import { User } from "./User";
import { Iteration } from "./Iteration.dto";
import { λIteration } from "@impactium/pattern";

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
  winner?: string | null,
  createdAt: number,
  has_lower_bracket: boolean,
  owner: User | null,
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
  public static pairs = (tournament: Tournament, length: number): Pairs<Team> => Array.from({ length }).map((_, i) => λTournament.size(tournament) === length ? λTournament.pair(tournament, i) : [undefined, undefined]);

  public static pair = (tournament: Tournament, i: number): Pair<Team> => [tournament.teams![i * 2], tournament.teams![i * 2 + 1]]

  public static size = (tournament: Tournament): number => tournament.iterations
    ? Math.max(...tournament.iterations.map(iteration => iteration.n))
    : 0;

  public static iteration = (use: Tournament | Iteration[], iteration: λIteration): Iteration | undefined => λTournament.use(use).find(i => i.n === iteration);

  public static upper = (use: Tournament | Iteration[]): Iteration[] => λTournament.use(use).filter(i => !i.is_lower_bracket);

  public static lower = (use: Tournament | Iteration[]): Iteration[] => λTournament.use(use).filter(i => i.is_lower_bracket);

  public static bracket = (tournament: Tournament, lower?: boolean): Iteration[] => lower ? λTournament.lower(tournament) : λTournament.upper(tournament)

  public static sort = (iterations: Iteration[]): Iteration[] => iterations.sort((a, b) => b.n - a.n);

  private static use = (use: Tournament | Iteration[]): Iteration[] => Array.isArray(use) ? use : (use.iterations || []);

  public static state = (tournament: Tournament): TournamentReadyState => convertISOstringToValue(tournament.start) > Date.now()
    ? TournamentReadyState.Upcoming
    : (convertISOstringToValue(tournament.end) > Date.now()
      ? TournamentReadyState.Ongoing
      : TournamentReadyState.Finished);

  public static round(round: number, totalRounds: number) {
    if (round === 1) return 'Финал';
    else if (round === 2) return 'Полуфинал';
    else if (round === 4) return 'Четвертьфинал';
    return `Раунд ${totalRounds / round}`;
  }
}
