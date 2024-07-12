'use client'
import { useLanguage } from "@/context/Language.context";
import { Panel } from "@/ui/Panel";
import s from './styles/Recomendations.module.css'
import { Button } from "@/ui/Button";
import CreateTeam from "@/banners/create_team/CreateTeam";
import { useApplication } from "@/context/Application.context";
import { CreateTournament } from "@/banners/create_tournament/CreateTournament";

type Title = 'tournament' | 'team';

interface RecomendationsProps {
  search: string,
  data: any[],
  Unit: any,
  title: Title
}

export function Recomendations({ search, data, title, Unit }: RecomendationsProps) {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();

  const Empty = () => (
    <div className={s.center}>
      <p>{lang[title].empty}</p>
      <Button onClick={() => spawnBanner(title === 'team' ? <CreateTeam /> : <CreateTournament />)}>{lang.create[title]}</Button>
    </div>
  );

  const NotFound = () => (
    <div className={s.center}>
      <p>{lang[title].not_found}</p>
    </div>
  )
  
  const filteredData: any[] = data.filter((unit: any) =>
    unit.indent.toLowerCase().includes(search.toLowerCase()) ||
    unit.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Panel heading={lang[title].recomendations} className={s.recomendations}>
      {search.length > 0
        ? (filteredData.length
          ? filteredData.map((unit: any) => <Unit key={unit.indent} data={unit} />)
          : <NotFound />)
        : (data.length
          ? data.map((unit: any) => <Unit key={unit.indent} data={unit} />)
          : <Empty />)}
  </Panel>
  );
}
