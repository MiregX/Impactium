import { convertISOstringToValue } from "@/lib/utils";
import { Team, λTeam } from "./Team.dto";
import { User } from "./User";
import { Iteration } from "./Iteration.dto";
import { Grid, λIteration } from "@impactium/pattern";
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
  public static pair = (tournament: Tournament, i: number): Battle | undefined => {
    if (tournament.teams) {
      return {
        slot1: tournament.teams?.[i * 2]?.indent,
        slot2: tournament.teams?.[i * 2 + 1]?.indent
      } as Battle;
    }
    return undefined;
  }

  public static size = (use: Tournament): number => use.iterations
    ? Math.max(...use.iterations.map(iteration => iteration.n))
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

  public static create = ({ code, title, banner: rawBanner, has_lower_bracket, iterations, settings }: Partial<Omit<Tournament, 'banner' | 'iterations' | 'settings'>> & { banner?: File, iterations?: λIteration, settings?: Grid }) => {
    const form = new FormData();
    code && form.append('code', code);
    title && form.append('title', title);
    rawBanner && form.append('banner', rawBanner);
    has_lower_bracket && form.append('has_lower_bracket', String(has_lower_bracket));
    iterations && form.append('iterations', String(iterations));
    settings && form.append('settings', JSON.stringify(settings));
    return form
  }
}
