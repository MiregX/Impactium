import { _server } from "@/dto/master";
import StatusPage from "./page";
import { ContextProvider } from './context'

export default async function StatusLayout({ children }) {
  const status = await fetch(`${_server(true)}/api/application/status`, {
    method: 'GET',
    next: {
      revalidate: 60
    }
  }).then(async response => {
    return await response.json()
  }).catch(error => {
    return null
  });

  return <ContextProvider prefetched={status} children={children} />;
}