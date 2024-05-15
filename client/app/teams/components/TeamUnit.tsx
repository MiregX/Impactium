import { TeamEntity_ComposedWithMembers } from '@api/main/team/addon/team.entity'
import s from '../Teams.module.css'
import { TeamUnitRoles } from './TeamUnitRoles'
import Link from 'next/link'

export function TeamUnit({ team }: { team: TeamEntity_ComposedWithMembers }) {
  console.log(team)
  return (
    <div className={s.unit}>
      <div className={s.logo}>
        {team.logo
          ? <img src={team.logo} />
          : <span>{team.title.slice(0, 1)}</span>
        }
      </div>
      <p>{team.title}</p>
      <span>·</span>
      <Link href={`/team/@${team.indent}`}>@{team.indent}</Link>
      <TeamUnitRoles members={team.members} />
    </div>
  )
}