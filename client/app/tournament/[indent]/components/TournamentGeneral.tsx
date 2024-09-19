'use client'

import { Card } from '@/ui/Card';
import { useTournament } from '../context';
import s from '../Tournament.module.css';
import { Button } from '@/ui/Button';

export function TournamentGeneral() {
  const { tournament } = useTournament();

  return (
    <Card className={s.general}>
      <p>Призовой фонд: {tournament.prize}$</p>
      <div className={s.group}>
        <Button>Найти команду</Button>
        <Button>Учавствовать</Button>
      </div>
    </Card>
  )
}