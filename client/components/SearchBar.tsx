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

interface SearchBarProps {
  search: string,
  setSearch: (value: string) => void,
  state: Team[] | Tournament[];
  setState: (value: any) => void;
  apiPath: 'team' | 'tournament'
}

export function SearchBar({ search, setSearch, setState, state, apiPath }: SearchBarProps) {
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const { spawnBanner } = useApplication();
  let searchTimeout: number | any;
  
  const fetchData = async (value: string): Promise<any[]> => {
    setLoading(true);
    const data = await api<any[]>(`/${apiPath}/find/${value}`, {
      next: {
        revalidate: 60
      }
    });
    setLoading(false);
    return data || [];
  };

  const handleSearchChange = (event: any) => {
    setSearch(event.target.value);
    if (event.target.value.length >= 3) {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        fetchData(event.target.value.toLowerCase()).then((results) => setState(mergeData(results)));
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
        image={loading
          ? 'https://cdn.impactium.fun/ui/action/redo.svg'
          : 'https://cdn.impactium.fun/ui/specific/mention.svg'
        }
        placeholder={lang._enter_indent_or_title}
        aria-label="Search"
        aria-invalid="false"
        type="search"
        value={search}
        className={loading && s.loading}
        onChange={handleSearchChange}
      />
      <Button onClick={() => spawnBanner(apiPath === 'team' ? <CreateTeam /> : <CreateTournament />)}>{lang.create[apiPath]}</Button>
    </div>
  )
}
