import { λIteration } from "@impactium/pattern";
import { Battle } from "./Battle.dto";

export interface Game {
  id: string;
  battle?: Battle;
  bid: string;
  n: λIteration;
  matchId: string | null;
  winner: string | null;
}