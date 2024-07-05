import s from '../Teams.module.css'
import { TeamUnitRoles } from './TeamUnitRoles'
import Link from 'next/link'
import { Team } from '@/dto/Team'
import { Avatar } from '@/components/Avatar'

export function TeamUnit({ team }: { team: Team }) {
  return (
    <Link className={s.unit} href={`/team/@${team.indent}`} >
      <div className={s.logo}>
        <Avatar src={team.logo} size={32} alt={team.indent} />
      </div>
      <p>{team.title}</p>
      <span>·</span>
      <h6>@{team.indent}</h6>
      <TeamUnitRoles members={team.members} />
    </Link>
  )
}