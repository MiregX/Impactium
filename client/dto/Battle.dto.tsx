import { Grid } from "./Grid.dto";
import { Team } from "./Team";

export interface Battle {
  id: string;
  gid: Grid['id'];
  iteration: number;
  slot1: Team['indent'] | null;
  slot2: Team['indent'] | null;
  winner: string | null;
  start: Date | null;
  end: Date | null;
}