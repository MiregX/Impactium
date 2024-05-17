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

export default function TeamsPage({ data }) {
  const { lang } = useLanguage();
  const { spawnBanner } = useMessage();
  const [teams, setTeams] = useState(data);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  let searchTimeout: number | any;

  useEffect(() => console.log(loading), [loading])

  const fetchTeams = async (type: 'find/' | 'get', value?: string) => {
    setLoading(true)
    const response = await fetch(`${_server()}/api/team/${type}/${value}`, {
      method: 'GET',
      next: {
        revalidate: 60
      }
    });
    setLoading(false)
    return response.json();
  };

  useEffect(() => {
    if (!data) {
      fetchTeams('get').then((teams) => {
        setTeams(mergeTeams(teams));
      });
    }
  }, [data]);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
    if (event.target.value.length > 3) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchTeams('find/', event.target.value.toLowerCase()).then((teams) => {
          setTeams(mergeTeams(teams));
        });
      }, 1000);
    }
  };

  const mergeTeams = (newTeams) => {
    const filteredTeams = teams.filter(team => !newTeams.some(newTeam => newTeam.indent === team.indent));

    return [...newTeams, ...filteredTeams];
  };  

  return (
    <PanelTemplate style={[s.wrapper]}>
      <div className={s.bar}>
        <Input
          image={loading
            ? 'https://cdn.impactium.fun/ui/specific/mention.svg'
            : 'https://cdn.impactium.fun/ui/action/redo.svg'
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
      <div className={s.recomendations}>
        <h4>Рекомендации</h4>
        <div className={s.list}>
          {teams.map((team) => (
            <TeamUnit key={team.indent} team={team} />
          ))}
        </div>
      </div>
    </PanelTemplate>
  );
}
