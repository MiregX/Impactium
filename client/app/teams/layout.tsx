import { _server } from '@/dto/master';
import TeamsPage from './page'
import { TeamsProvider } from './context';

export default async function TeamsLayout({ children }) {
  const teams = await fetch(`${_server()}/api/team/get`, {
    method: 'GET',
    next: {
      revalidate: 60
    }
  })
  .then(async (res) => {
    return await res.json();
  })
  .catch(_ => {
    return null;
  });

  return <TeamsProvider prefetched={teams} children={children} />;
};
