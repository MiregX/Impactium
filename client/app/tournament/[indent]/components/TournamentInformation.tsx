'use client'
import { Card } from '@/ui/Card';
import { useTournament } from '../context';
import { Button } from '@/ui/Button';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import s from '../Tournament.module.css';
import { Separator } from '@/ui/Separator';

export function TournamentInformation({}) {
  const { tournament } = useTournament();

  return (
    <Card className={s.information}>
      <p>Организатор:</p>
      <Combination id={tournament.owner.uid} src={tournament.owner.avatar} name={tournament.owner.displayName} />
      <Separator />
      <p>Мест: 12 / 16</p>
      <span>Свободно: 4</span>
      <Separator />
      <p>Участники</p>
      <div className={s.members}>
        {tournament.teams.length
        ? tournament.teams.map(team => (
          <Combination id={team.indent} src={team.logo} name={team.title} />
        ))
        : Array.from({ length: 16 }).map((_, i) => <CombinationSkeleton />)
        }
      </div>
      <Separator />
      <p>Начало через: 16 часов 43 минуты</p>
    </Card>
  )
}