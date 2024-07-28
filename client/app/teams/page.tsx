'use client'
import { useEffect, useState } from 'react';
import { PanelTemplate } from '@/components/PanelTempate';
import { useLanguage } from '@/context/Language.context';
import { TeamUnit } from './components/TeamUnit';
import s from './Teams.module.css';
import { Panel } from '@/ui/Panel';
import { Team } from '@/dto/Team';
import { useUser } from '@/context/User.context';
import React from 'react';
import { useTeams } from './context';
import { Recomendations } from '@/components/Recomentations';
import { SearchBar } from '@/components/SearchBar';
import { UserEntity } from '@/dto/User';
import { useApplication } from '@/context/Application.context';
import { Button } from '@/ui/Button';
import CreateTeam from '@/banners/create_team/CreateTeam';

export default function TeamsPage() {
  const { spawnBanner } = useApplication();
  const { teams, setTeams } = useTeams();
  const { lang } = useLanguage();
  const { user } = useUser();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    console.log(teams);
    !teams && api<Team[]>('/team/get', (teams) => setTeams(teams ? teams?.map(team => ({
      ...team,
      members: team.members?.map(member =>({
        ...member,
        user: new UserEntity(member.user)
      }))
    })) : []));;
  }, [teams]);


  const Empty = () => (
    <div className={s.center}>
      <p>{lang.team.empty}</p>
      <Button onClick={() => spawnBanner(<CreateTeam />)}>{lang.create.team}</Button>
    </div>
  );

  const NotFound = () => (
    <div className={s.center}>
      <p>{lang.team.not_found}</p>
    </div>
  )
  
  const filteredData: Team[] = teams ? teams.filter((unit: any) =>
    unit.indent
      ? unit.indent.toLowerCase().includes(search.toLowerCase())
      : unit.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
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
      {/* Рекомендации */}
      <Panel heading={lang.team.recomendations} className={s.recomendations}>
        {search.length > 0
          ? (filteredData.length
            ? filteredData.map((team: Team) => <TeamUnit key={team.indent} team={team} />)
            : <NotFound />)
          : (teams && teams.length
            ? teams.map((team: Team) => <TeamUnit key={team.indent} team={team} />)
            : <Empty />)}
      </Panel>
    </PanelTemplate>
  );
}
