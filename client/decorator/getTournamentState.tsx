import { Tournament } from "@/dto/Tournament";
import { TournamentState } from "@/dto/TournamentState.dto";

type State = Tournament | [Date, Date];

export const getTournamentState = (state: State | Date, endDate?: Date): TournamentState => {
  const [start, end] = state instanceof Date
    ? [state, endDate!]
    : Array.isArray(state)
      ? state
      : [state.start, state.end];

  const now = new Date();

  return now < start ? 'Upcoming' : now <= end ? "Ongoing" : "Finished";
};
