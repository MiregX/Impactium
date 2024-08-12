'use client'
import { Input } from '@/ui/Input'
import s from './styles/SearchBar.module.css'
import { useLanguage } from '@/context/Language.context'
import { useState } from 'react';
import { Button } from '@/ui/Button';
import { useApplication } from '@/context/Application.context';
import CreateTeam from '@/banners/create_team/CreateTeam'
import { CreateTournament } from '@/banners/create_tournament/CreateTournament';
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team';
import { useApperand } from '@/decorator/useAperand';
import { cn } from '@/lib/utils';
import { TeamOrTournament } from '@/dto/TeamOrTournament.type';

interface SearchBarProps {
  search: string,
  setSearch: (value: string) => void,
  state: Team[] | Tournament[];
  setState: (value: any) => void;
  apiPath: TeamOrTournament;
  loading: boolean,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SearchBar({ search, setSearch, setState, state, apiPath, loading, setLoading }: SearchBarProps) {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();
  let searchTimeout: number | any;
  
  const fetchData = async (value: string): Promise<any[]> => {
    setLoading(true);
    return await api<any[]>(`/${apiPath}/find/${value}`, {
      next: {
        revalidate: 60
      }
    }) || [];
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
    if (event.target.value.length >= 3) {
      setLoading(!!event.target.value);
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchData(event.target.value.toLowerCase()).then((results) => {
          setState(mergeData(results));
          setLoading(false);
        });
      }, 1000);
    }
  };

  const mergeData = <T extends Team | Tournament>(newData: T[]): T[] => {
    const filteredData = (state as T[]).filter((unit: T) => 
      !newData.some(data => useApperand(data, ['indent', 'code']) === useApperand(unit, ['indent', 'code']))
    );
    return [...newData, ...filteredData];
  };

  return (
    <div className={s.bar}>
      <Input
        img={'https://cdn.impactium.fun/ui/specific/mention.svg'}
        placeholder={lang.search[apiPath]}
        aria-label="Search"
        aria-invalid="false"
        type="search"
        value={search}
        className={cn(loading && s.loading)}
        onChange={handleSearchChange}
        loading={loading}
      />
      <Button onClick={() => spawnBanner(apiPath === 'team' ? <CreateTeam /> : <CreateTournament />)}>{lang.create[apiPath]}</Button>
    </div>
  )
}
