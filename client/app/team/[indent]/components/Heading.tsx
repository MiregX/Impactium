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
        <img src={team.logo} onError={null} />
        <p>{team.title}</p>
        <hr data-align='vertical' />
        <h6>@{team.indent}</h6>
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