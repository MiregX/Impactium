import { fetchDataset } from '@/dto/FetchDataset'
import { TournamentsProvider } from './context'
import TournamentPage from './page'

export default function TournamentsLayout({ children }) {
  const tournaments = fetchDataset('/api/tournament/get')
  return <TournamentsProvider children={children} prefetched={tournaments} />;
}