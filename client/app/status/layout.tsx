import { _server } from "@/dto/master";
import StatusPage from "./page";

export default async function StatusLayout() {
  const status = await fetch(`${_server(true)}/api/application/status`, {
    method: 'GET',
    next: {
      revalidate: 60
    }
  }).then(async response => {
    return await response.json()
  }).catch(error => {
    return undefined
  });

  return (
    <StatusPage status={status} />
  )
}