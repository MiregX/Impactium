import { TeamUnit } from "@/components/TeamUnit";
import { Tournament } from "@/dto/Tournament";
import { Team } from "@/dto/Team.dto";
import { TournamentUnit } from "@/components/TournamentUnit";
import { TeamOrTournament } from "@/dto/TeamOrTournament.type";
import { NotFound } from "@/components/NotFound";
import { Empty } from "@/components/Empty";
import { TeamOrTournamentUnitSkeleton } from "@/components/Skeletons";

interface PostProcessingProps<T> {
  search: string;
  type: TeamOrTournament;
  data: T[],
  filtered: T[],
  current: number[],
  loading: boolean
}

export function PostProcessing<T extends Team | Tournament>({ type, search, data, loading,  filtered, current }: PostProcessingProps<T>) {
  const Unit = ({ data }: { data: Team | Tournament }) => type === 'team' ? <TeamUnit team={data as Team} /> : <TournamentUnit tournament={data as Tournament} />

  // Если есть фильтр
  if (search.length > 0) {
    if (filtered.length) {
      return current.map((i) => <Unit key={i} data={filtered[i]} />)
    } else if (loading) {
      return <TeamOrTournamentUnitSkeleton type={type} />;
    } else {
      return <NotFound type={type} />
    }
  // Без фильтра
  } else if (data) {
    if (data.length) {
      return current.map((i) => <Unit key={i} data={data[i]} />)
    } else {
      return <Empty type={type} />
    }
  } else {
    return <TeamOrTournamentUnitSkeleton type={type} />
  }
}