import { Card } from '@/ui/Card'
import s from './styles/TournamentUnit.module.css'
import { getTournamentState } from '@/decorator/getTournamentState'
import { Badge, BadgeType } from '@/ui/Badge'
import { Tournament } from '@/dto/Tournament'

interface TournamentUnitProps {
  tournament: Tournament;
}

export function TournamentUnit({ tournament }: TournamentUnitProps) {
  return (
    <Card className={s.card} id={tournament.code} key={tournament.code}>
      <h6>{tournament.title}</h6>
      <div className={s.container}>
        <Badge type={BadgeType[getTournamentState(tournament)]} title={getTournamentState(tournament)} />
        <span>Aug 15 - Aug 27,2023</span>
      </div>
        <p>
          <img src="https://cdn.impactium.fun/ui/specific/trophy.svg" alt="" />
          $20,45
        </p>
        <p>
          <img src="https://cdn.impactium.fun/ui/user/users.svg" alt="" />
          16 teams
        </p>
        <p>
          <img src="https://cdn.impactium.fun/ui/specific/dart.svg" alt="" />
          Team A 2 - 1 Team B
        </p>
        <p>
          <img src="https://cdn.impactium.fun/ui/specific/watch-live.svg" alt="" />
          <a href="">
            Watch live
          </a>
        </p>
    </Card>
    )
}
