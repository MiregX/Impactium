'use client'
import { Input } from '@/ui/Input'
import s from './styles/SearchBar.module.css'
import { useLanguage } from '@/context/Language.context'
import { Button } from '@impactium/components';
import { useApplication } from '@/context/Application.context';
import { ManageTournamentBanner } from '@/banners/ManageTournament.banner';
import { Tournament } from '@/dto/Tournament';
import { Team } from '@/dto/Team.dto';
import { useApperand } from '@/decorator/useAperand';
import { cn } from '@impactium/utils';
import { TeamOrTournament } from '@/dto/TeamOrTournament.type';
import { ManageTeamBanner } from '@/banners/ManageTeam.banner';

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
        img='AtSign'
        placeholder={lang.search[apiPath]}
        aria-label="Search"
        aria-invalid="false"
        type="search"
        value={search}
        className={cn(loading && s.loading)}
        onChange={handleSearchChange}
        loading={loading}
      />
      <Button onClick={() => spawnBanner(apiPath === 'team' ? <ManageTeamBanner /> : <ManageTournamentBanner />)}>{lang.create[apiPath]}</Button>
    </div>
  )
}
