import { λIteration } from "@impactium/pattern";
import { Battle } from "./Battle.dto";

export interface Iteration {
  id: string;
  tid: string;
  n: λIteration;
  is_lower_bracket: boolean;
  best_of: number;
  startsAt: Date;
  battles: Battle[];
}
