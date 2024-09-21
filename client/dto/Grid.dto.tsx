import { Battle } from "./Battle.dto";
import { Tournament } from "./Tournament";

export interface Grid {
  id: string;
  tid: Tournament['id'];
  tournament?: Tournament;
  max: number;
  battles: Battle[];
}