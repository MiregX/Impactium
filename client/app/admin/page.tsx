'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { DeleteTournaments } from "./components/DeleteTournaments";
import { DeleteTeams } from "./components/DeleteTeams";

export default function AdminPage() {
  return (
    <PanelTemplate useStart>
      <DeleteTournaments />
      <DeleteTeams />
    </PanelTemplate>
  )
}
