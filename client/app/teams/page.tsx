'use client'
import { useEffect, useState } from 'react';
import { PanelTemplate } from '@/components/PanelTempate';
import { useLanguage } from '@/context/Language.context';
import { TeamUnit } from '../../components/TeamUnit';
import s from './Teams.module.css';
import { Panel } from '@/ui/Panel';
import { Team } from '@/dto/Team.dto';
import { useUser } from '@/context/User.context';
import React from 'react';
import { useTeams } from './context';
import { SearchBar } from '@/components/SearchBar';
import { UserEntity } from '@/dto/User';
import { usePagination } from '@/decorator/usePagination';
import { Pagination } from '@/components/Pagination';
import { useItemsPerPage } from '@/decorator/useItemsPerPage';
import { PostProcessing } from '@/decorator/PostProcessing';

export default function TeamsPage() {
  const { teams, setTeams } = useTeams();
  const { lang } = useLanguage();
  const { user } = useUser();
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { itemsPerPage } = useItemsPerPage();
  const [fetched, setFetched] = useState<boolean>(!!teams.length);

  useEffect(() => {
    !fetched && api<Team[]>('/team/list', (teams) => setTeams(teams ? teams?.map(team => ({
      ...team,
      members: team.members?.map(member =>({
        ...member,
        user: new UserEntity(member.user)
      }))
    })) : [])).then(() => setFetched(true));
  }, [teams]);

  const filteredData: Team[] = teams ? teams.filter((unit: Team) =>
    unit.indent
      ? unit.indent.toLowerCase().includes(search.toLowerCase())
      : unit.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const dataToPaginate = search.length > 0 ? filteredData : teams || [];

  const { page, total, setPage, getPageNumbers, current } = usePagination({
    totalItems: dataToPaginate.length,
    itemsPerPage,
    buttons: 5
  });

  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
        loading={loading}
        setLoading={setLoading}
        search={search}
        setSearch={setSearch}
        state={teams || []}
        setState={setTeams}
        apiPath={'team'} />
      {/* Команды пользователя */}
      {user?.teams && user.teams.length ?
        <Panel heading={lang.team.yours} className={s.minimized}>
          <React.Fragment>
            {user.teams.map((team: Team) => (
              <TeamUnit key={team.indent} team={team} />
            ))}
          </React.Fragment>
        </Panel>
      : null}
      <Pagination
        className={s.pagination}
        page={page}
        total={total}
        getPageNumbers={getPageNumbers}
        setPage={setPage} />
      {/* Рекомендации */}
      <div className={s.grid}>
        <PostProcessing search={search} type={'team'} data={teams} filtered={filteredData} current={current} loading={loading} />
      </div>
    </PanelTemplate>
  );
}
