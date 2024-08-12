'use client'
import { PanelTemplate } from "@/components/PanelTempate";
import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { useTournaments } from "./context";
import s from './Tournaments.module.css';
import { Tournament } from "@/dto/Tournament";
import { usePagination } from "@/decorator/usePagination";
import { Pagination } from "@/components/Pagination";
import { UserEntity } from "@/dto/User";
import { useItemsPerPage } from "@/decorator/useItemsPerPage";
import { PostProcessing } from "@/decorator/PostProcessing";

export default function TournamentPage() {
  const { tournaments, setTournaments } = useTournaments();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { itemsPerPage } = useItemsPerPage(5);

  useEffect(() => {
    !tournaments && api<Tournament[]>('/tournament/get', (tournaments) => setTournaments(tournaments ? tournaments.map(tournament => ({
      ...tournament,
      teams: tournament.teams?.map(team =>({
        ...team,
        members: team.members ? team.members.map(member => ({ ...member, user: new UserEntity(member.user)})) : []
      }))
    })) : []));;
  }, [tournaments]);

  const filteredData: Tournament[] = tournaments ? tournaments.filter((tournament: Tournament) =>
    tournament.code
      ? tournament.code.toLowerCase().includes(search.toLowerCase())
      : tournament.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const dataToPaginate = search.length > 0 ? filteredData : tournaments;

  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: dataToPaginate.length,
    itemsPerPage,
    buttons: 5
  });

  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        setState={setTournaments}
        state={tournaments}
        apiPath='tournament'
        loading={loading}
        setLoading={setLoading} />
      <Pagination
        className={s.pagination}
        page={page}
        total={total}
        getPageNumbers={getPageNumbers}
        setPage={setPage}
      />
      <div className={s.grid}>
        <PostProcessing search={search} type={'tournament'} data={tournaments} filtered={filteredData} current={current} loading={loading} />
      </div>
    </PanelTemplate>
  )
}
