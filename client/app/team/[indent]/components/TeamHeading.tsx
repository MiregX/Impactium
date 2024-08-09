import { Avatar } from '@/components/Avatar'
import s from './styles/TeamHeading.module.css'
import { Team } from '@/dto/Team'

interface TeamHeadingProps {
  team: Team
}

export function TeamHeading({ team }: TeamHeadingProps) {
  return (
    <div className={s.heading}>
      <Avatar size={64} src={team.logo} alt={team.title} />
      <div className={s.text}>
        <p>{team.title}</p>
        <h6>@{team.indent}</h6>
      </div>
    </div>
  )
}