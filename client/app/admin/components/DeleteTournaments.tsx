import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { useLanguage } from '@/context/Language.context';
import { Tournament } from '@/dto/Tournament';
import { useState, useEffect } from 'react';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { Button } from '@/ui/Button';

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
      {tournaments
        ? tournaments?.map(t => (
          <div className={s.unit}>
            <Combination id={t.code} size='full' src={t.banner} name={t.title} />
            <Button img='Trash2' size='icon' variant='ghost' onClick={() => deleteTournament(t.id)} />
          </div>
        ))
        : Array.from({ length: 4}).map((_, i) => <CombinationSkeleton button size='full' key={i} />)
      }
    </Card>
  )
}
