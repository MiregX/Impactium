'use client'
import { ManageTournamentBanner } from "@/banners/ManageTournament.banner";
import { useApplication } from "@/context/Application.context";
import { useLanguage } from "@/context/Language.context";
import { Button } from "@/ui/Button";
import s from './styles/_.module.css';
import { TeamOrTournamentProp } from "@/dto/TeamOrTournament.type";
import { ManageTeamBanner } from "@/banners/ManageTeam.banner";

export const Empty = ({ type }: TeamOrTournamentProp) => {
  const { lang } = useLanguage();
  const { spawnBanner } = useApplication();

  return (
    <div className={s.center}>
      <p>{lang[type].empty}</p>
      <Button onClick={() => spawnBanner(type === 'team' ? <ManageTeamBanner /> : <ManageTournamentBanner />)}>{lang.create[type]}</Button>
    </div>
  );
}