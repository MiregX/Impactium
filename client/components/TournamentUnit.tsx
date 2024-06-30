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
      <Badge type={BadgeType[getTournamentState(tournament)]} title={getTournamentState(tournament)} />
    </Card>
    )
}