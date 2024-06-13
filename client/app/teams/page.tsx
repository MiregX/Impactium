'use client'
import { useEffect, useState } from 'react';
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';
import { useLanguage } from '@/context/Language';
import { TeamUnit } from './components/TeamUnit';
import s from './Teams.module.css';
import { Panel } from '@/ui/Panel';
import { Team } from '@/dto/Team';
import { useUser } from '@/context/User';
import React from 'react';
import { useTeams } from './context';
import { Recomendations } from '@/components/owerviewPageTemplate/Recomentations';
import { SearchBar } from '@/components/owerviewPageTemplate/SearchBar';

export default function TeamsPage() {
  const { teams, setTeams } = useTeams();
  const { lang } = useLanguage();
  const { user } = useUser();
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (!teams) {
      get('/api/team/get', {
        method: 'GET',
        next: {
          revalidate: 60
        }
      })
      .then(teams => {
        setTeams(teams || []);
      })
      .catch(_ => {
        setTeams([]);
      });
    }
    console.log(teams)
  }, [teams])

  return (
    <PanelTemplate useColumn={true}>
      <SearchBar
        search={search}
        setSearch={setSearch}
        state={teams}
        setState={setTeams}
        langPathKey={'team'}
        apiPath={'/api/team/find'} />
      {/* Команды пользователя */}
      {user?.teams ?
        <Panel heading={lang.team.yours} styles={[s.minimized]}>
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
