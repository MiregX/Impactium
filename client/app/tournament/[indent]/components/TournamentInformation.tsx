'use client'
import { Card } from '@/ui/Card';
import { useTournament } from '../context';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import s from '../Tournament.module.css';
import { Separator } from '@/ui/Separator';
import Countdown from 'react-countdown';
import { Button } from '@/ui/Button';
import { LoginBanner } from '@/banners/login/Login.banner';
import { ParticapateTournamentBanner } from './ParticapateTournament.banner';
import { useApplication } from '@/context/Application.context';
import { useUser } from '@/context/User.context';
import { TournamentRules } from './TournamentRules.banner';
import { TournamentReadyState, λTournament } from '@/dto/Tournament';
import { Fragment } from 'react';
import { TeamUnitSkeleton } from '@/components/TeamUnit';
import Link from 'next/link';
import { Icon } from '@/ui/Icon';

export function TournamentInformation({}) {
  const { tournament, assignTournament } = useTournament();
  const { spawnBanner } = useApplication();
  const { user } = useUser();

  console.log(tournament);

  const max = λTournament.size(tournament);

  return (
    <Card className={s.information}>
      <h3>Основная информация</h3>
      <div className={s.node}>
        <p>Организатор:</p>
        {tournament.owner
          ? <Combination id={tournament.owner.uid} src={tournament.owner.avatar} name={tournament.owner.displayName} />
          : <CombinationSkeleton />
        }
      </div>
      <div className={s.pod}>
        {max > 0
          ? (<Fragment>
            <p>Мест: {tournament.teams?.length || '...'} / {max}</p>
            <span>(cвободно: {max - (tournament.teams?.length || 0)})</span>
          </Fragment>)
          : <p></p>}
      </div>
      <Separator />
      <div className={s.members}>
        {tournament.teams
          ? tournament.teams.length
            ? tournament.teams.map(team => (
                <div key={team.indent} className={s.team_unit}>
                  <Combination id={team.indent} src={team.logo} name={team.title} />
                  <Button variant='ghost' asChild>
                    <Link prefetch={false} href={`/team/@${team.indent}`}>
                      Открыть
                      <Icon variant='dimmed' name='MoveRight' />
                    </Link>
                  </Button>
                </div>
              ))
            : <span>Все места свободны</span>
          : <TeamUnitSkeleton  />
        }
      </div>
      <Separator />
      <div className={s.time} suppressHydrationWarning>
        <p>{λTournament.state(tournament) === TournamentReadyState.Upcoming
          ? 'Начнётся через'
          : λTournament.state(tournament) === TournamentReadyState.Ongoing
            ? 'Закончится через'
            : null}</p>
        <Countdown date={tournament.start}>
          <Countdown date={tournament.end}>
            <span>Турнир закончился</span>
          </Countdown>
        </Countdown>
      </div>
      <div className={s.time} style={{ marginTop: 0, marginBottom: 8 }}>
        <p>Призовой фонд</p>
        <span>{tournament.prize}$</span>
      </div>
      <Separator />
      <div className={s.participate}>
        <Button onClick={() => spawnBanner(user ? <ParticapateTournamentBanner tournament={tournament} assignTournament={assignTournament} /> : <LoginBanner />)}>Учавствовать</Button>
        <Button variant='ghost' onClick={() => spawnBanner(<TournamentRules tournament={tournament} />)}>Регламент турнира</Button>
      </div>
    </Card>
  )
}