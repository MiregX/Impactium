'use client'
import s from './Heading.module.css'
import { useLogo, useTeam } from "@/context/Team"

export function Heading({ state }) {
  return (
    <div className={s.heading}>
      {useLogo(state)}
      <div className={s.text}>
        <p>{state.title}</p>
        <h6>@{state.indent}</h6>
      </div>
    </div>
  )
}