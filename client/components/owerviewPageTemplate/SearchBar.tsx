'use client'
import { Input } from '@/ui/Input'
import s from './SearchBar.module.css'
import { useLanguage } from '@/context/Language'
import { useState } from 'react';
import { Button, ButtonTypes } from '@/ui/Button';
import { useApplication } from '@/context/Application';
import CreateTeam from '@/banners/create_team/CreateTeam'
import CreateTournament from '@/banners/create_tournament/CreateTournament';

export function SearchBar({ search, setSearch, setState, state, langPathKey, apiPath }) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { spawnBanner } = useApplication();
  let searchTimeout: number | any;
  
  const fetchData = async (value: string): Promise<any[]> => {
    setLoading(true)
    const data = await api(`${apiPath}/${value}`, {
      method: 'GET',
      next: {
        revalidate: 60
      }
    }) as any[] ?? [];
    setLoading(false)
    return data;
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value.length >= 3) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchData(event.target.value.toLowerCase()).then((teams) => {
          setState(mergeData(teams));
        });
      }, 1000);
    }
  };

  const mergeData = (newData: any[] ): any[] => {
    const filteredData = state.filter((unit: any) => !newData.some(data => data.indent === unit.indent));
    return [...newData, ...filteredData];
  };  

  return (
    <div className={s.bar}>
      <Input
        image={loading
          ? 'https://cdn.impactium.fun/ui/action/redo.svg'
          : 'https://cdn.impactium.fun/ui/specific/mention.svg'
        }
        placeholder={lang._enter_indent_or_title}
        aria-label="Search"
        aria-invalid="false"
        type="search"
        value={search}
        style={[loading && s.loading]}
        onChange={handleSearchChange}
      />
      <Button
        options={{
          type: ButtonTypes.Button,
          do: () => spawnBanner(langPathKey === 'team' ? <CreateTeam /> : <CreateTournament />),
          text: lang.create[langPathKey],
          focused: true,
          className: s.button
        }} />
  </div>
  )
}