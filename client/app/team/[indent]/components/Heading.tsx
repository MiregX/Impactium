'use client'
import s from '../Team.module.css'
import { useLanguage } from "@/context/Language";
import { useLogo, useTeam } from "@/context/Team"
import { useUser } from '@/context/User';
import { GeistButton, GeistButtonTypes } from "@/ui/GeistButton";

export function Heading() {
  const { team } = useTeam();
  const { user } = useUser();
  const { lang } = useLanguage();

  return (
    <div className={s.heading}>
      {useLogo(team)}
      <div className={s.text}>
        <p>{team.title}</p>
        <h6>@{team.indent}</h6>
      </div>
    </div>
  )
}