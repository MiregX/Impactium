'use client'
import s from '../Team.module.css'
import { useLanguage } from "@/context/Language";
import { useTeam } from "@/context/Team"
import { GeistButton, GeistButtonTypes } from "@/ui/GeistButton";

export function Heading({ toggleEditable }) {
  const { team } = useTeam();
  const { lang } = useLanguage();

  return (
    <div className={s.heading}>
      <div>
        <h6>{team.title}</h6>
        <hr data-align='vertical' />
        <span>{team.indent}</span>
      </div>
      <GeistButton options={{
            type: GeistButtonTypes.Button,
            action: toggleEditable,
            text: lang.team.edit_team,
            focused: true
          }} />
    </div>
  )
}