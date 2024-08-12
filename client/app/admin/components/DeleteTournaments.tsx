import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Avatar } from '@/ui/Avatar';
import { useLanguage } from '@/context/Language.context';
import { Tournament } from '@/dto/Tournament';
import { Button } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { useState, useEffect } from 'react';

export function DeleteTournaments() {
  const { lang } = useLanguage();
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
  
  const reloadTournaments = () => api<Tournament[]>('/tournament/get', setTournaments)

  useEffect(() => {
    if (!tournaments) reloadTournaments();
  }, [tournaments])

  const deleteTournament = (id: string) => {
    api(`/tournament/delete/${id}`, {
      method: 'DELETE'
    }, reloadTournaments)
  }

  return (
    <Card className={s.delete}>
      <h6>{lang.tournament.delete}</h6>
      {tournaments ? tournaments?.map(tournament => (
        <div className={s.unit} key={tournament.id}>
          <Avatar size={36} src={tournament.banner} alt={tournament.title} />
          <div className={s.sub}>
            <p className={s.bold}>{tournament.title}</p>
            <p>@{tournament.code}</p>
          </div>
          <Button img='https://cdn.impactium.fun/ui/trash/full.svg' size='icon' variant='ghost' onClick={() => deleteTournament(tournament.id)} />
        </div>
      )) : Array.from({ length: 4}).map((_, i) => (
        <div className={s.unit} key={i}>
          <Skeleton variant='avatar' size='icon' />
          <div className={s.sub}>
            <Skeleton />
            <Skeleton width={96} />
          </div>
          <Skeleton size='icon' />
        </div>
      ))}
    </Card>
  )
}
