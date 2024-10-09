import { convertISOstringToValue } from "@/lib/utils";
import { Team, λTeam } from "./Team.dto";
import { User } from "./User";
import { Iteration } from "./Iteration.dto";
import { λIteration } from "@impactium/pattern";
import { Joinable } from "./Joinable.dto";
import { Battle } from "./Battle.dto";

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
  public static pairs = (tournament: Tournament, iteration: Iteration): any => {
    const length = λTournament.size(tournament) / 2;

    console.log(iteration.n)

    return Array.from({ length }).map((_, i) => {
      const battle = iteration.battles?.[i];
      if (battle) {
        return λTournament.pair(tournament, battle)
      }
      if (length / 2 === iteration.n) {
        return λTournament.pair(tournament, i)
      }
      return [undefined, undefined];
    })
  }

  public static pair = (tournament: Tournament, i: number | Battle): Pair<Team> => {
    if (tournament.teams) {
      if (typeof i !== 'number') {
        return [λTeam.find(tournament.teams, i.slot1), λTeam.find(tournament.teams, i.slot2)]
      } else {
        return [tournament.teams![i * 2], tournament.teams![i * 2 + 1]];
      }
    }
    return [undefined, undefined];  
  }

  public static size = (tournament: Tournament): number => tournament.iterations
    ? Math.max(...tournament.iterations.map(iteration => iteration.n)) * 2
    : 0;

  public static joinable = (tournament: Tournament): Joinable => λTournament.size(tournament) > ((tournament.teams?.length || 0))
    ? Joinable.Free
    : Joinable.Closed;

  public static iteration = (use: Tournament | Iteration[], iteration: λIteration, isLowerBracket: boolean = false): Iteration | undefined => λTournament.bracket(use, isLowerBracket).find(i => i.n === iteration);

  public static next = (use: Tournament | Iteration[], iteration: Iteration): Iteration | undefined => {
    const bracket = λTournament.bracket(use, iteration.is_lower_bracket);
    return bracket[bracket.findIndex(i => i.n === iteration.n) + 1];
  }

  public static upper = (use: Tournament | Iteration[]): Iteration[] => λTournament.use(use).filter(i => !i.is_lower_bracket);

  public static lower = (use: Tournament | Iteration[]): Iteration[] => λTournament.use(use).filter(i => i.is_lower_bracket);

  public static bracket = (tournament: Tournament | Iteration[], isLowerBracket: boolean): Iteration[] => isLowerBracket ? λTournament.lower(tournament) : λTournament.upper(tournament)

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
