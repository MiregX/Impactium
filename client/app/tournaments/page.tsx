'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import { Recomendations } from "@/components/Recomentations";
import React, { useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import s from './Tournaments.module.css'
import { useTournaments } from "./context";
import { TournamentUnit } from "@/components/TournamentUnit";

export default function TournamentPage() {
  const { tournaments, setTournaments } = useTournaments();
  const [search, setSearch] = useState<string>('');
  
  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        setState={setTournaments}
        state={tournaments}
        apiPath='tournament' />
      {/* Рекомендации турниров */}
      <Recomendations search={search} data={tournaments} Unit={TournamentUnit} title='tournament' />
    </PanelTemplate>
  )
}
