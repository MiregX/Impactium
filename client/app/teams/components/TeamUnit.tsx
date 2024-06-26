import s from '../Teams.module.css'
import { TeamUnitRoles } from './TeamUnitRoles'
import Link from 'next/link'
import { useLogo } from '@/context/Team'
import { Team } from '@/dto/Team'

export function TeamUnit({ team }: { team: Team }) {
  return (
    <Link className={s.unit} href={`/team/@${team.indent}`} >
      <div className={s.logo}>
        {useLogo(team)}
      </div>
      <p>{team.title}</p>
      <span>·</span>
      <h6>@{team.indent}</h6>
      <TeamUnitRoles members={team.members} />
    </Link>
  )
}