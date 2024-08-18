import s from './styles/_.module.css'
import { Team } from '@/dto/Team'
import { Card } from '@/ui/Card'
import { Button } from '@/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { Combination, CombinationSkeleton } from '@/ui/Combitation'

export function TeamUnit({ team }: { team: Team }) {
  return (
    <Card className={s.unit} key={team.indent}>
      <Combination className={s.team_combination} src={team.logo} name={team.title} id={team.indent} />
      <Button variant='ghost' asChild>
        <Link href={`/team/${team.indent}`}>
          Подробнее
          <Image width='24' height='24' src='https://cdn.impactium.fun/ui/arrow-lg/right.svg' alt='' />
        </Link>
      </Button>
    </Card>
  )
}

export function TeamUnitSkeleton() {
  return (
    <Card className={s.unit}>
      <CombinationSkeleton />
    </Card>
  )
}
