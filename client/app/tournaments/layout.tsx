import { ReactNode } from '@/dto/ReactNode';
import { TournamentsProvider } from './context'

export default async function TournamentsLayout({ children }: ReactNode) {
  const tournaments = await api('/tournament/get')
  return <TournamentsProvider children={children} prefetched={tournaments || []} />;
}