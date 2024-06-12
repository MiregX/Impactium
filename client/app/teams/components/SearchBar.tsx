'use client'
import { Input } from '@/ui/Input'
import s from '../Teams.module.css'
import { useLanguage } from '@/context/Language'
import { _server } from '@/dto/master';
import { useState } from 'react';
import { Team } from '@/dto/Team';
import { GeistButton, GeistButtonTypes } from '@/ui/Button';
import { useApplication } from '@/context/Application';
import CreateTeam from '@/banners/create_team/CreateTeam';

export function SearchBar({ search, setSearch, setTeams, teams }) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { spawnBanner } = useApplication();
  let searchTimeout: number | any;
  
  const findTeams = async (value: string): Promise<Team[]> => {
    setLoading(true)
    const team = await get(`/api/team/find/${value}`, {
      method: 'GET',
      next: {
        revalidate: 60
      }
    }) as Team[] ?? [];
    setLoading(false)
    return team;
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value.length >= 3) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        findTeams(event.target.value.toLowerCase()).then((teams) => {
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
      value={search}
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
  )
}