import { Team } from '@/dto/Team.dto';
import { Combination, CombinationProps, CombinationSkeleton } from '@/ui/Combitation';
import s from './styles/_.module.css';
import { cn } from '@/lib/utils';

interface TeamCombinationProps extends Omit<CombinationProps, 'id' | 'src' | 'name'> {
  team: Team | undefined | null;
  winner: boolean | null
}

export function TeamCombination({ team, winner, className, ...props }: TeamCombinationProps) {
  if (!team) return <CombinationSkeleton {...props} />;

  return <Combination className={cn(typeof winner === 'boolean' && (winner ? s.winner : s.loser), className)} id={team.indent} src={team.logo} name={team.title} {...props} />
}
