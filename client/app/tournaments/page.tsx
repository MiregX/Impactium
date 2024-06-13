'use client'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Recomendations } from "@/components/owerviewPageTemplate/Recomentations";
import React, { useState } from "react";
import { SearchBar } from "@/components/owerviewPageTemplate/SearchBar";
import s from './Tournaments.module.css'
import { TournamentUnit } from "./components/TournamentUnit";
import { useTournaments } from "./context";

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
        langPathKey='tournament'
        apiPath={'/api/tournament/find'}  />
      {/* Рекомендации турниров */}
      <Recomendations search={search} data={tournaments} unit={TournamentUnit} />
    </PanelTemplate>
  )
}