import s from '../Teams.module.css'
import { TeamUnitRoles } from './TeamUnitRoles'
import Link from 'next/link'

export function TeamUnit({ team }) {
  console.log(team)
  return (
    <Link className={s.unit} href={`/team/@${team.indent}`} >
      <div className={s.logo}>
        {team.logo
          ? <img src={team.logo + '?t=' + Date.now()} />
          : <span>{team.title.slice(0, 1)}</span>
        }
      </div>
      <p>{team.title}</p>
      <span>·</span>
      <h6>@{team.indent}</h6>
      <TeamUnitRoles members={team.members} />
    </Link>
  )
}