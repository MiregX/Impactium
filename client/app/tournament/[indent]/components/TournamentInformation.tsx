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
      <h3>Основная информация</h3>
      <div className={s.node}>
        <p>Организатор:</p>
        <Combination id={tournament.owner.uid} src={tournament.owner.avatar} name={tournament.owner.displayName} />
      </div>
      <div className={s.pod}><p>Мест: 12 / 16</p><span>(cвободно: 4)</span></div>
      <Separator />
      <div className={s.members}>
        {tournament.teams.length
        ? tournament.teams.map(team => (
          <Combination id={team.indent} src={team.logo} name={team.title} />
        ))
        : Array.from({ length: 16 }).map((_, i) => <CombinationSkeleton />)
        }
      </div>
      <Separator />
      <div className={s.time}>
        <span>Начало через:</span>
        <p>16 часов 43 минуты</p>
      </div> 
    </Card>
  )
}