'use client'
import { ManageTeamBanner } from '@/banners/ManageTeam.banner'
import { useApplication } from '@/context/Application.context'
import { useUser } from '@/context/User.context'
import { Team } from '@/dto/Team.dto'
import { UserEntity } from '@/dto/User'
import { Banner } from '@/ui/Banner'
import { Button } from '@/ui/Button'
import { Combination, CombinationSkeleton } from '@/ui/Combitation'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/ui/Select'
import { Separator } from '@/ui/Separator'
import { useEffect, useState } from 'react'
import s from '../Tournament.module.css';
import Link from 'next/link'
import { Tournament } from '@/dto/Tournament'
import { TournamentContext } from '../context'
import { TeamOrTournamentUnitSkeleton } from '@/components/Skeletons'

export function ParticapateTournamentBanner({ tournament, assignTournament }: Pick<TournamentContext, 'tournament' | 'assignTournament'>) {
  const { spawnBanner, destroyBanner } = useApplication();
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

  const join = () => {
    if (!team) return;

    api<Tournament>(`/tournament/${tournament.code}/join/${team!.indent}`, {
      method: 'POST'
    }, assignTournament).then(() => {
      destroyBanner()
    })
  }

  return (
    <Banner title='Учавствовать в турнире' className={s.participate}>
      {user ? (
        <div className={s.choose}>
          <Select onValueChange={indent => setTeam(user.teams!.find(team => team.indent === indent)!)} value={team?.indent}>
            <SelectTrigger className={s.trigger}>
              {team ? <Combination id={team.indent} src={team.logo} name={team.title} /> : 'Команду не выбрано'}
            </SelectTrigger>
            <SelectContent>
              {user.teams
                ? user.teams.map(team => <SelectItem key={team.indent} value={team.indent} children={<Combination id={team.indent} src={team.logo} name={team.title} />} />)
                : <TeamOrTournamentUnitSkeleton type='team' length={2} />
              }
            </SelectContent>
          </Select>
        </div>
      ) : <p>Вы не состоите ни в одной команде</p>}
      <Separator><i>ИЛИ</i></Separator>
      <div className={s.group}>
        <Button variant='ghost' onClick={() => spawnBanner(<ManageTeamBanner />)}>Создать команду</Button>
        <Button asChild variant={team ? 'ghost' : 'default'}>
          <Link href='/teams'>
            Найти команду
          </Link>
        </Button>
        <Button onClick={join} img='Check' variant={team ? 'default' : 'disabled'}>Учавствовать</Button>
      </div>
    </Banner>
  )
}