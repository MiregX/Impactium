import { Game } from "./Game.dto";
import { Iteration } from "./Iteration.dto";
import { Team } from "./Team.dto";

export interface Battle {
  id: string;
  slot1: Team['indent'];
  slot2: Team['indent'] | null;
  is_slot_one_winner: boolean | null;
  start: Date | null;
  iteration?: Iteration;
  iid: string;
  games: Game[];
  createdAt: Date;
}
