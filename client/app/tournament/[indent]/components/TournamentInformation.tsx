  'use client'
import { Card } from '@/ui/Card';
import { useTournament } from '../context';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import s from '../Tournament.module.css';
import { Separator } from '@/ui/Separator';
import Countdown from 'react-countdown';
import { Button } from '@impactium/components';
import { LoginBanner } from '@/banners/login/Login.banner';
import { ParticapateTournamentBanner } from './ParticapateTournament.banner';
import { useApplication } from '@/context/Application.context';
import { useUser } from '@/context/User.context';
import { TournamentRules } from './TournamentRules.banner';
import { TournamentReadyState, λTournament } from '@/dto/Tournament';
import { TeamUnitSkeleton } from '@/components/TeamUnit';
import Link from 'next/link';
import { Icon } from '@impactium/icons';

export function TournamentInformation({}) {
  const { tournament, assignTournament } = useTournament();
  const { spawnBanner } = useApplication();
  const { user } = useUser();

  console.log(tournament);

  const max = λTournament.size(tournament);
  
  const joinable = λTournament.joinable(tournament)

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
          ? <p>Мест: {max - ((tournament.teams?.length || 0))} / {max}</p>
          : <p></p>}
      </div>
      <Separator />
      <div className={s.members}>
        {(tournament.teams || Array.from({ length: λTournament.size(tournament)})).map(team => (
          team
          ? <div key={team.indent} className={s.team_unit}>
              <Combination id={team.indent} src={team.logo} name={team.title} />
              <Button variant='ghost' asChild>
                <Link prefetch={false} href={`/team/@${team.indent}`}>
                  Открыть
                  <Icon variant='dimmed' name='MoveRight' />
                </Link>
              </Button>
            </div>
          : <TeamUnitSkeleton  />
        ))}
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
        <Button variant='ghost' onClick={() => spawnBanner(<TournamentRules assignTournament={assignTournament} tournament={tournament} />)}>Регламент турнира</Button>
      </div>
    </Card>
  )
}