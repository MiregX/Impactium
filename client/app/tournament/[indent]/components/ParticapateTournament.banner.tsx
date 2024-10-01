'use client'
import { ManageTeamBanner } from '@/banners/manage_team/ManageTeam.banner'
import { useApplication } from '@/context/Application.context'
import { useUser } from '@/context/User.context'
import { Team } from '@/dto/Team.dto'
import { UserEntity } from '@/dto/User'
import { Banner } from '@/ui/Banner'
import { Button } from '@/ui/Button'
import { Combination } from '@/ui/Combitation'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select'
import { Separator } from '@/ui/Separator'
import { useEffect, useState } from 'react'
import s from '../Tournament.module.css';
import Link from 'next/link'

export function ParticapateTournament() {
  const { spawnBanner } = useApplication();
  const { user, setUser } = useUser();
  const [team, setTeam] = useState<Team | null>(null);
  const [loaded, setLoaded] = useState<boolean>(!!user?.teams);

  useEffect(() => {
    if (!user || user.teams) return;

    api<Team[]>('/team/get', teams => {
      setUser(() => new UserEntity({ ...UserEntity.normalize(user), teams }));
      setTeam(teams[0] || null);
    });
  }, []);

  return (
    <Banner title='Учавствовать в турнире' className={s.participate}>
      {user ? (
        <div className={s.choose}>
          <Select onValueChange={indent => setTeam(user.teams!.find(team => team.indent === indent)!)} value={team?.indent}>
            <SelectTrigger>
              {team ? <Combination id={team.indent} src={team.logo} name={team.title} /> : 'Команду не выбрано'}
            </SelectTrigger>
            <SelectContent>
              {user.teams?.length && user.teams?.map(team => (
                <SelectItem key={team.indent} value={team.indent}>
                  <Combination id={team.indent} src={team.logo} name={team.title} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button img='Check' variant={team ? 'default' : 'disabled'}>Учавствовать</Button>
        </div>
      ) : <p>Вы не состоите ни в одной команде</p>}
      <Separator><i>ИЛИ</i></Separator>
      <div className={s.group}>
        <Button variant='secondary' onClick={() => spawnBanner(<ManageTeamBanner />)}>Создать команду</Button>
        <Button asChild>
          <Link href='/teams'>
            Найти команду
          </Link>
        </Button>
      </div>
    </Banner>
  )
}