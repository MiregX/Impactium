import { _server } from "@/dto/master"
import { redirect } from "next/navigation";
import ChangelogPage from './page'

export default async function ChangelogLayout() {
  const log = await fetch(`${_server()}/api/changelog`, {
    method: 'GET'
  })
  .then(async response => await response.json())
  .catch(() => redirect('/'));

  return (
    <ChangelogPage log={ log } />
  )
}