import { Card } from '@/ui/Card';
import s from '../Admin.module.css';
import { Avatar } from '@/components/Avatar';
import { useLanguage } from '@/context/Language.context';
import { Button } from '@/ui/Button';
import { Skeleton } from '@/ui/Skeleton';
import { useState, useEffect } from 'react';
import { Team } from '@/dto/Team';

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
          <Avatar size={36} src={team.logo} alt={team.title} />
          <div className={s.sub}>
            <p className={s.bold}>{team.title}</p>
            <p>@{team.indent}</p>
          </div>
          <Button img='https://cdn.impactium.fun/ui/trash/full.svg' size='icon' variant='ghost' onClick={() => deleteTeam(team.indent)} />
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
