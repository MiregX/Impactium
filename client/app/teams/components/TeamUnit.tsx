import s from '../Teams.module.css'
import { Team } from '@/dto/Team'
import { Card } from '@/ui/Card'
import { Button } from '@/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { Combination, CombinationSkeleton } from '@/components/Combitation'

export function TeamUnit({ team }: { team: Team }) {
  return (
    <Card className={s.unit} key={team.indent}>
      <Combination src={team.logo} name={team.title} id={team.indent} />
      <Button variant='ghost' asChild>
        <Link href={`/team/${team.indent}`}>
          Подробнее
          <Image width='24' height='24' src='https://cdn.impactium.fun/ui/arrow-lg/right.svg' alt='' />
        </Link>
      </Button>
    </Card>
  )
}

export function TeamUnitSkeletoned() {
  return (
    <Card className={s.unit}>
      <CombinationSkeleton />
    </Card>
  )
}