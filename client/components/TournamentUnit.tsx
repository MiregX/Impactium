import { Card } from '@/ui/Card'
import s from './styles/TournamentUnit.module.css'
import { getTournamentState } from '@/decorator/getTournamentState'
import { Badge, BadgeType } from '@/ui/Badge'
import { Tournament } from '@/dto/Tournament'
import Link from 'next/link'
import Image from 'next/image'
import { getReadableDate } from '@/decorator/getReadableDate'
import React from 'react'
import { Button } from '@/ui/Button'
import { Combination, CombinationSkeleton } from '../ui/Combitation'
import { Skeleton } from '@/ui/Skeleton'

interface TournamentUnitProps {
  tournament: Tournament;
}

export function TournamentUnit({ tournament }: TournamentUnitProps) {
  return (
    <Card className={s.card} id={tournament.code} key={tournament.code}>
      <div className={s.heading}>
        <Combination src={tournament.banner} name={tournament.title} id={tournament.code} />
        <Button variant='ghost' asChild>
          <Link href={`/tournament/${tournament.code}`}>
            Подробнее
            <Image width='24' height='24' src='https://cdn.impactium.fun/ui/arrow-lg/right.svg' alt='' />
          </Link>
        </Button>
      </div>
      <div className={s.container}>
        <Badge type={BadgeType[getTournamentState(tournament)]} title={getTournamentState(tournament)} />
        <Badge type={BadgeType.prize} title={`$${tournament.prize}.00`} />
        <span>{getReadableDate(tournament.start, { year: false })} - {getReadableDate(tournament.end, { year: false })} UTC</span>
      </div>
    </Card>
  );
};

export function TournamentUnitSkeleton() {
  return (
    <Card className={s.card}>
      <div className={s.heading}>
        <CombinationSkeleton />
      </div>
      <div className={s.container}>
        <Skeleton variant='badge' />
        <Skeleton variant='badge' />
        <Skeleton size='short' />
      </div>
    </Card>
  )
}