import { λIteration } from "@impactium/pattern";
import { Battle } from "./Battle.dto";

export interface Iteration {
  id: string;
  tid: string;
  n: λIteration;
  is_upper: boolean
  is_lower_bracket: boolean
  battles: Battle[]
}
