import { TeamsProvider } from './context';
import { Team } from '@/dto/Team';

export default async function TeamsLayout({ children }) {
  const teams = await api('/team/find', {
    method: 'GET',
    next: {
      revalidate: 60
    }
  }) as Team[];

  return <TeamsProvider prefetched={teams} children={children} />;
};
