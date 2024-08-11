import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Avatar } from '@/components/Avatar';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { useState, useEffect } from 'react';
import { Team } from '@/dto/Team';
import { Combination, CombinationSkeleton } from '@/components/Combitation';

export function DeleteTeams() {
  const { lang } = useLanguage();
  const [teams, setTeams] = useState<Team[] | null>(null);
  
  const reloadTeams = () => api<Team[]>('/team/get', setTeams)

  useEffect(() => {
    if (!teams) reloadTeams();
  }, [teams])

  const deleteTeam = (id: string) => {
    api(`/team/delete/${id}`, {
      method: 'DELETE'
    }, reloadTeams)
  }

  return (
    <Card className={s.delete}>
      <h6>{lang.team.delete}</h6>
      {teams ? teams?.map(team => (
        <div className={s.unit} key={team.indent}>
          <Combination src={team.logo} name={team.title} id={team.indent} />
          <Button img='https://cdn.impactium.fun/ui/trash/full.svg' size='icon' variant='ghost' onClick={() => deleteTeam(team.indent)} />
        </div>
      )) : Array.from({ length: 4}).map((_, i) => <CombinationSkeleton />)
      }
    </Card>
  )
}
