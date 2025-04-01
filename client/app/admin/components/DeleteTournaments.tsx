import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Language } from '@/context/Language.context';
import { Tournament } from '@/dto/Tournament';
import { useState, useEffect } from 'react';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { Button } from '@impactium/components';

export function DeleteTournaments() {
  const { lang } = Language.use();
  const [tournaments, setTournaments] = useState<Tournament[] | null>(null);
  
  const reloadTournaments = () => api<Tournament[]>('/tournament/get', setTournaments)

  useEffect(() => {
    if (!tournaments) reloadTournaments();
  }, [tournaments])

  const deleteTournament = (code: string) => {
    api(`/tournament/${code}/delete`, {
      method: 'DELETE'
    }, reloadTournaments)
  }

  return (
    <Card className={s.delete}>
      <h6>{lang.tournament.delete}</h6>
      {tournaments
        ? tournaments?.map(t => (
          <div className={s.unit}>
            <Combination id={t.code} size='full' src={t.banner} name={t.title} />
            <Button img='Trash2' size='icon' variant='ghost' onClick={() => deleteTournament(t.code)} />
          </div>
        ))
        : Array.from({ length: 4}).map((_, i) => <CombinationSkeleton button size='full' key={i} />)
      }
    </Card>
  )
}
