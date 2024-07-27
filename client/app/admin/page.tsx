'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { DeleteTournaments } from "./components/DeleteTournaments";

export default function AdminPage() {
  return (
    <PanelTemplate useStart>
      <DeleteTournaments />
    </PanelTemplate>
  )
}
