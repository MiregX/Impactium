import { _server } from '@/dto/master';
import { TeamsProvider } from './context';
import { Team } from '@/dto/Team';

export default async function TeamsLayout({ children }) {
  const teams = await get('/api/team/find', {
    method: 'GET',
    next: {
      revalidate: 60
    }
  }) as Team[];

  return <TeamsProvider prefetched={teams} children={children} />;
};
