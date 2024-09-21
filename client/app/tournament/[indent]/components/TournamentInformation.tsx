'use client'
import { Card } from '@/ui/Card';
import { useTournament } from '../context';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import s from '../Tournament.module.css';
import { Separator } from '@/ui/Separator';
import Countdown from 'react-countdown';
import { Button } from '@/ui/Button';
import { LoginBanner } from '@/banners/login/LoginBanner';
import { ParticapateTournament } from './ParticapateTournament.banner';
import { useApplication } from '@/context/Application.context';
import { useUser } from '@/context/User.context';
import { TournamentRules } from './TournamentRules.banner';
import { getTournamentReadyState, TournamentReadyState } from '@/lib/utils';

export function TournamentInformation({}) {
  const { tournament } = useTournament();
  const { spawnBanner } = useApplication();
  const { user } = useUser();

  return (
    <Card className={s.information}>
      <h3>Основная информация</h3>
      <div className={s.node}>
        <p>Организатор:</p>
        <Combination id={tournament.owner.uid} src={tournament.owner.avatar} name={tournament.owner.displayName} />
      </div>
      <div className={s.pod}>
        <p>Мест: {tournament.teams.length} / {tournament.grid?.max || '∞'}</p>
        <span>(cвободно: {tournament.grid?.max ? tournament.grid?.max - tournament.teams.length : '∞'})</span>
      </div>
      <Separator />
      <div className={s.members}>
        {tournament.teams.length
          ? tournament.teams.map(team => <Combination key={team.indent} id={team.indent} src={team.logo} name={team.title} />)
          : <span>Все места свободны</span>
        }
      </div>
      <Separator />
      <div className={s.time}>
        <p>{getTournamentReadyState(tournament) === TournamentReadyState.Upcoming
          ? 'Начнётся через'
          : getTournamentReadyState(tournament) === TournamentReadyState.Ongoing
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
        <Button onClick={() => spawnBanner(user ? <ParticapateTournament /> : <LoginBanner />)}>Учавствовать</Button>
        <Button variant='ghost' onClick={() => spawnBanner(<TournamentRules tournament={tournament} />)}>Регламент турнира</Button>
      </div>
    </Card>
  )
}