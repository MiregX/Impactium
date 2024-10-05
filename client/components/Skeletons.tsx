import { TeamCombinationSkeleton } from "@/components/TeamUnit";
import { TournamentUnitSkeleton } from "@/components/TournamentUnit";
import { TeamOrTournamentProp } from "@/dto/TeamOrTournament.type";

interface TeamOrTournamentUnitSkeleton {
  length?: number
}

export const TeamOrTournamentUnitSkeleton = ({ type, length = 21 }: TeamOrTournamentProp & TeamOrTournamentUnitSkeleton) => Array.from({ length }).map((_, i) => type === 'team' ? <TeamCombinationSkeleton /> : <TournamentUnitSkeleton />);