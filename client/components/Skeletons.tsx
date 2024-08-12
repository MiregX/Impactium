import { TeamUnitSkeleton } from "@/components/TeamUnit";
import { TournamentUnitSkeleton } from "@/components/TournamentUnit";
import { TeamOrTournamentProp } from "@/dto/TeamOrTournament.type";

export const Skeletons = ({ type }: TeamOrTournamentProp) => Array.from({ length: 21}).map((_, i) => type === 'team' ? <TeamUnitSkeleton /> : <TournamentUnitSkeleton />);