import { Card } from '@/ui/Card'
import s from './styles/TournamentUnit.module.css'
import { Badge, BadgeType } from '@/ui/Badge'
import { Tournament, λTournament } from '@/dto/Tournament'
import Link from 'next/link'
import { λUtils } from '@impactium/utils'
import React from 'react'
import { Button } from '@/ui/Button'
import { Combination, CombinationSkeleton } from '../ui/Combitation'
import { Skeleton } from '@/ui/Skeleton'
import { Icon } from '@/ui/Icon'

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
            <Icon size={24} variant='dimmed' name='MoveRight' />
          </Link>
        </Button>
      </div>
      <div className={s.container}>
        <Badge type={BadgeType[λTournament.state(tournament)]} title={λUtils.capitalize(λTournament.state(tournament))} />
        <Badge type={BadgeType.prize} title={`$${tournament.prize}.00`} />
        <span>{λUtils.readableDate(tournament.start, { year: false })} - {λUtils.readableDate(tournament.end, { year: false })} UTC</span>
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