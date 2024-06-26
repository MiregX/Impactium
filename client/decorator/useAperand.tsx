import { Team } from "@/dto/Team";
import { Tournament } from "@/dto/Tournament";

export function useApperand(state: Team | Tournament, keys: keyof Team | keyof Tournament) {
  return state[keys[0]] || state[keys[1]]
}