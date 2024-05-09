import { TeamEntity } from '@api/main/team/team.entity'
import s from '../Teams.module.css'
import { TeamUnitRoles } from './TeamUnitRoles'
import Link from 'next/link'

export function TeamUnit({ team }: { team: TeamEntity }) {
  return (
    <div className={s.unit}>
      {team.logo && <img src={team.indent} />}
      <p>{team.title}</p>
      <hr />
      <Link href={`/team/@${team.indent}`}>@{team.indent}</Link>
      <TeamUnitRoles members={[]} />
    </div>
  )
}