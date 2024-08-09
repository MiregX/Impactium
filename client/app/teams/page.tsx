'use client'
import { useEffect, useState } from 'react';
import { PanelTemplate } from '@/components/PanelTempate';
import { useLanguage } from '@/context/Language.context';
import { TeamUnit, TeamUnitSkeletoned } from './components/TeamUnit';
import s from './Teams.module.css';
import { Panel } from '@/ui/Panel';
import { Team } from '@/dto/Team';
import { useUser } from '@/context/User.context';
import React from 'react';
import { useTeams } from './context';
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
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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

  const _Skeletons = () => Array.from({ length: 21}).map((_, i) => <TeamUnitSkeletoned key={i} />);
  
  const filteredData: Team[] = teams ? teams.filter((unit: any) =>
    unit.indent
      ? unit.indent.toLowerCase().includes(search.toLowerCase())
      : unit.title.toLowerCase().includes(search.toLowerCase())
  ) : [];

  const PostProcessing = () => {
    // При поиске пользователем при запросе в <SearchBar />
    if (search.length > 0) {
      if (filteredData.length) {
        return filteredData.map((team: Team) => <TeamUnit key={team.indent} team={team} />)
      } else if (loading) {
        return <_Skeletons />;
      } else {
        return <NotFound />
      }
    // Команды загружены (Array а не null)
    } else if (teams) {
      // Если длинна масива больше 0
      if (teams.length) {
        return teams.map((team: Team) => <TeamUnit key={team.indent} team={team} />)
      } else {
        // Иначе ставим заглушку
        return <Empty />  
      }
    } else {
      return <_Skeletons />
    }
  }

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
      {/* Рекомендации */}
      <div className={s.grid}>
        <PostProcessing />
      </div>
    </PanelTemplate>
  );
}
