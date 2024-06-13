'use client'
import s from '..Tournament.module.css'
import { useLogo, useTeam } from "@/context/Team"

export function Heading() {
  const { team } = useTeam();

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