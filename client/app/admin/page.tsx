'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { DeleteTournaments } from "./components/DeleteTournaments";
import { DeleteTeams } from "./components/DeleteTeams";
import { ToggleLanding } from "./components/ToggleLanding";
import s from './Admin.module.css';
import { Impersonate } from "./components/Impersonate";
import { Console } from "./components/Console";

export default function AdminPage() {
  return (
    <PanelTemplate useStart className={s.page}>
      <DeleteTournaments />
      <DeleteTeams />
      <ToggleLanding />
      <Impersonate />
      <Console />
    </PanelTemplate>
  )
}
