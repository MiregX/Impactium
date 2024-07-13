import { Card } from '@/ui/Card'
import s from './styles/TournamentUnit.module.css'
import { getTournamentState } from '@/decorator/getTournamentState'
import { Badge, BadgeType } from '@/ui/Badge'
import { Tournament } from '@/dto/Tournament'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/context/Language.context'
import { getReadableDate } from '@/decorator/getReadableDate'
import React from 'react'

interface TournamentUnitProps {
  tournament: Tournament;
}

export function TournamentUnit({ tournament }: TournamentUnitProps) {
  return (
    <Card className={s.card} id={tournament.code} key={tournament.code}>
      <h6>{tournament.title}</h6>
      <div className={s.container}>
        <Badge type={BadgeType[getTournamentState(tournament)]} title={getTournamentState(tournament)} />
        <span>{getReadableDate(tournament.start, { year: false })} - {getReadableDate(tournament.end)} UTC</span>
      </div>
      <Description tournament={tournament} />
      <WatchLive url={tournament.live} />
    </Card>
  );
};

function WatchLive({ url }: { url?: string }) {
  'use client'
  const { lang } = useLanguage();
  return url && (
    <Link href={url}>
      <Image src='https://cdn.impactium.fun/ui/specific/watch-live.svg' alt='' />
      {lang._watch_live}
    </Link>
  );
}

function Description({ tournament }: TournamentUnitProps) {
  'use client'
  const { lang } = useLanguage();

  const map = [
    ['$' + (tournament.prize || 0), 'specific/trophy.svg'],
    [lang.team.amount + ': ' + tournament.teams.length, 'user/users.svg'],
    // Ближайшее сражение которое должно произойти * на сумарное кол-во ммр обеих команд
    [tournament.grid && tournament.grid.sort((battle: any) => battle), 'specific/dart.svg'],
  ]

  return (
    <React.Fragment>
      {map.map((keys, index) =>
        <p key={index}><Image src={`https://cdn.impactium.fun/ui/${keys[1]}`} width={24} height={24} alt='' />{keys[0]}</p>
      )}
    </React.Fragment>
  );
}