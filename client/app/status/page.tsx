import { PanelTemplate } from "@/components/main/PanelTempate";
import { _server } from "@/dto/master";
import { Unit } from "./components/Unit";

export default async function StatusPage() {
  const status = await fetch(`${_server()}/api/application/info`, {
    method: 'GET'
  }).then(async response => {
    return await response.json()
  }).catch(error => {
    return undefined
  });

  return (
    <PanelTemplate>
      {status.statuses.map(status => {
        <Unit shard={status} />
      })}
    </PanelTemplate>
  )
}