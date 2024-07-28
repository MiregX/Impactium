import { Children } from '@/dto/Children';
import { TeamsProvider } from './context';
import { Team } from '@/dto/Team';

export default async function TeamsLayout({ children }: Children) {
  const teams = await api<Team[]>('/team/get');

  return <TeamsProvider prefetched={teams} children={children} />;
};
