import { Children } from '@/types';
import { TournamentsProvider } from './context'
import { Tournament } from '@/dto/Tournament';

export default async function TournamentsLayout({ children }: Children) {
  const tournaments = await api<Tournament[]>('/tournament/get', {
    next: {
      revalidate: 180
    }
  });
  return <TournamentsProvider children={children} prefetched={tournaments || []} />;
}
