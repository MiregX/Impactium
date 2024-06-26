'use client'
import { useLanguage } from "@/context/Language";
import { Panel } from "@/ui/Panel";
import s from './Recomendations.module.css'

interface RecomendationsProps {
  search: string,
  data: any,
  unit: any
}

export function Recomendations({ search, data, unit: TeamUnit }: RecomendationsProps) {
  const { lang } = useLanguage();
  return (
    <Panel heading={lang.team.recomendations} className={s.recomendations}>
      {search.length > 0
        ? (data.filter((unit: any) => {
          return unit.indent.toLowerCase().includes(search.toLowerCase()) || unit.title.toLowerCase().includes(search.toLowerCase())
        }).map((unit: any) =>
        <TeamUnit key={unit.indent} data={unit} />
      )) : (data.map((unit: any) => (
        <TeamUnit key={unit.indent} data={unit} />
      )))}
  </Panel>
  );
}