'use client'
import { useLanguage } from "@/context/Language.context";
import { Panel } from "@/ui/Panel";
import s from './styles/Recomendations.module.css'
import { Button } from "@/ui/Button";
import CreateTeam from "@/banners/create_team/CreateTeam";
import { useApplication } from "@/context/Application.context";

type Title = 'tournaments' | 'teams';

interface RecomendationsProps {
  search: string,
  data: any,
  unit: any,
  title: Title
}

export function Recomendations({ search, data, title, unit: TeamUnit }: RecomendationsProps) {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();

  const Empty = ({title}: { title: Title }) => {
    return <div className={s.empty}>
      <p>{lang[title].empty}</p>
      <Button onClick={() => spawnBanner(<CreateTeam />)}>{lang.create.team}</Button>
    </div>
  };

  return (
    <Panel heading={lang.team.recomendations} className={s.recomendations}>
      {search.length > 0
        ? (data.filter((unit: any) => {
          return unit.indent.toLowerCase().includes(search.toLowerCase()) || unit.title.toLowerCase().includes(search.toLowerCase())
        }).map((unit: any) =>
        <TeamUnit key={unit.indent} data={unit} />
      )) : (data.length
        ? data.map((unit: any) => <TeamUnit key={unit.indent} data={unit} />)
        : <Empty title={title} />)}
  </Panel>
  );
}
