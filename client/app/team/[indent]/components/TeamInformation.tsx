import { Card } from '@/ui/Card';
import s from '../Team.module.css';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { useTeam } from '../team.context';
import { Separator } from '@/ui/Separator';
import { Button } from '@/ui/Button';

export function TeamInformation() {
  const { team } = useTeam();

  return (
    <Card className={s.information}>
      <h3>Основная информация</h3>
      <div className={s.node}>
        <p>Владелец:</p>
        {team.owner ? <Combination id={team.owner.uid} src={team.owner.avatar} name={team.owner.displayName} /> : <CombinationSkeleton />}
      </div>
      <div className={s.pod}>
        <p>Выиграно турниров: {team.tournaments?.length}</p>
        <span></span>
      </div>
      <Separator />
      <div className={s.tournaments}>
        {team.tournaments?.length
          ? team.tournaments.map(tournament => <Combination key={tournament.code} id={tournament.code} src={tournament.banner} name={tournament.title} />)
          : <span>Команда не учавствовала в турнирах</span>
        }
      </div>
      <Separator />
      <div className={s.group}>
        <Button>Присоеденится</Button>
        <Button variant='ghost'>Связь с командой</Button>
      </div>
    </Card>
  )
}
