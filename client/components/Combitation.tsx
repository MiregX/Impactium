import { Skeleton } from '@/ui/Skeleton';
import { Avatar } from './Avatar'
import s from './styles/Combination.module.css'

interface CombinationProps {
  src: string | null | undefined;
  name: string;
  id: string
}

export function Combination({ src, name, id }: CombinationProps) {
  return (
    <div className={s.combination}>
      <Avatar size={36} src={src} alt={name} />
      <div className={s.group}>
        <p className={s.name}>{name}</p>
        {id && <p className={s.id}>@ {id}</p>}
      </div>
    </div>
  )
}

export function CombinationSkeleton() {
  return (
    <div className={s.combination}>
      <Skeleton variant='avatar' />
      <div className={s.group}>
        <Skeleton className={s.name} />
        <Skeleton className={s.id} size='short' />
      </div>
    </div>
  )
}