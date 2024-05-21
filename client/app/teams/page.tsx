'use client'
import { useEffect, useState } from 'react';
import { Input } from '@/ui/Input';
import { PanelTemplate } from '@/components/main/PanelTempate';
import { _server } from '@/dto/master';
import { useLanguage } from '@/context/Language';
import { useMessage } from '@/context/Message';
import { GeistButton, GeistButtonTypes } from '@/ui/GeistButton';
import CreateTeam from '@/banners/create_team/CreateTeam';
import { TeamUnit } from './components/TeamUnit';
import s from './Teams.module.css';
import { Panel } from '@/ui/Panel';
import { Team } from '@/dto/Team';
import { useUser } from '@/context/User';

export default function TeamsPage({ data }) {
  const { lang } = useLanguage();
  const { spawnBanner } = useMessage();
  const [teams, setTeams] = useState(data);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  let searchTimeout: number | any;

  const fetchTeams = async (type: 'find' | 'get', value?: string): Promise<Team[]> => {
    setLoading(true)
    const response = await fetch(`${_server()}/api/team/${type}/${value}`, {
      method: 'GET',
      next: {
        revalidate: 60
      }
    });
    setLoading(false)
    return response.ok ? await response.json() : [];
  };

  const userTeams = fetch('')

  useEffect(() => {
    if (!data) {
      fetchTeams('get').then((teams) => {
        setTeams(mergeTeams(teams));
      });
    }
  }, [data]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length >= 3) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchTeams('find', event.target.value.toLowerCase()).then((teams) => {
          setTeams(mergeTeams(teams));
        });
      }, 1000);
    }
  };

  const mergeTeams = (newTeams: Team[] ): Team[] => {
    const filteredTeams = teams.filter((team: Team) => !newTeams.some(newTeam => newTeam.indent === team.indent));

    return [...newTeams, ...filteredTeams];
  };  

  return (
    <PanelTemplate style={[s.wrapper]}>
      <div className={s.bar}>
        <Input
          image={loading
            ? 'https://cdn.impactium.fun/ui/action/redo.svg'
            : 'https://cdn.impactium.fun/ui/specific/mention.svg'
          }
          placeholder={lang.team.enter_indent_or_title}
          aria-label="Search"
          aria-invalid="false"
          type="search"
          value={searchValue}
          style={[loading && s.loading]}
          onChange={handleSearchChange}
        />
        <GeistButton
          options={{
            type: GeistButtonTypes.Button,
            do: () => spawnBanner(<CreateTeam />),
            text: lang.create.team,
            focused: true,
            style: [s.button]
          }}
        />
      </div>
      <Panel heading={lang.team.yours}>
        {user.teams?.map((team: Team) => {
          <TeamUnit key={team.indent} team={team} />
        })}
      </Panel>
      <Panel heading={lang.team.recomendations} styles={[s.recomendations]}>
        {searchValue.length > 0 ? (teams.filter((team: Team) => team.indent.toLowerCase().includes(searchValue.toLowerCase()) || team.title.toLowerCase().includes(searchValue.toLowerCase())).map((team: Team) =>
          <TeamUnit key={team.indent} team={team} />
        )) : (teams.map((team) => (
          <TeamUnit key={team.indent} team={team} />
        )))}
      </Panel>
    </PanelTemplate>
  );
}
