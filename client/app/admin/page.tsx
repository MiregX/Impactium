'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { DeleteTournaments } from "./components/DeleteTournaments";
import { DeleteTeams } from "./components/DeleteTeams";
import { ToggleLanding } from "./components/ToggleLanding";

export default function AdminPage() {
  return (
    <PanelTemplate useStart>
      <DeleteTournaments />
      <DeleteTeams />
      <ToggleLanding />
    </PanelTemplate>
  )
}
