import { TournamentsProvider } from './context'
import TournamentPage from './page'

export default async function TournamentsLayout({ children }) {
  const tournaments = await get('/api/tournament/get')
  return <TournamentsProvider children={children} prefetched={tournaments} />;
}