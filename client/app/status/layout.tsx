import { _server } from "@/dto/master";
import { StatusProvider } from './context'

export default async function StatusLayout({ children }) {
  const status = await fetch(`${_server(true)}/api/application/status`, {
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

  return <StatusProvider prefetched={status} children={children} />;
}