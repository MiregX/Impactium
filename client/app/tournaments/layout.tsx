import { Children } from '@/dto/Children';
import { TournamentsProvider } from './context'
import { Tournament } from '@/dto/Tournament';

export default async function TournamentsLayout({ children }: Children) {
  const tournaments = await api<Tournament[]>('/tournament/get') || [];
  return <TournamentsProvider children={children} prefetched={tournaments} />;
}