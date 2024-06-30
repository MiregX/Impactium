import { Tournament } from '@/dto/Tournament'
import { Avatar } from './Avatar'
import s from './styles/Heading.module.css'
import { Team } from '@/dto/Team'
import { useApperand } from '@/decorator/useAperand'

export function Heading({ state }: { state: Team | Tournament}) {
  return (
    <div className={s.heading}>
      <Avatar size={0} src={useApperand(state, ['logo', 'banner'])} alt={state.title} />
      <div className={s.text}>
        <p>{state.title}</p>
        <h6>@{useApperand(state, ['indent', 'code'])}</h6>
      </div>
    </div>
  )
}