import { TournamentsProvider } from './context'

export default async function TournamentsLayout({ children }) {
  const tournaments = await get('/api/tournament/get')
  return <TournamentsProvider children={children} prefetched={tournaments || []} />;
}