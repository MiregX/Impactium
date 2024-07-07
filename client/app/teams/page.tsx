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

export default function TeamsPage() {
  const { teams, setTeams } = useTeams();
  const { lang } = useLanguage();
  const { user } = useUser();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    !teams && api<Team[]>('/team/get').then(teams => setTeams(teams || []));
  }, [teams])

  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        state={teams}
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
      <Recomendations search={search} data={teams} unit={TeamUnit} />
    </PanelTemplate>
  );
}
