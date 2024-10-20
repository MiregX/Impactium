import { Tournament } from "@/dto/Tournament";
import { Banner } from "@/ui/Banner";
import { Button } from "@/ui/Button";

interface TournamentRulesProps {
  tournament: Tournament;
  assignTournament: (tournament: Tournament) => void;
}

export function TournamentRules({ tournament, assignTournament }: TournamentRulesProps) {

  const generateIteration = () => {
    api(`/tournament/${tournament.code}/generate-iteration`, {
      method: 'POST',
      toast: 'Итерация догенерирована',
    });
  }

  const insertTeam = () => {
    api(`/tournament/${tournament.code}/insert-team`, {
      method: 'POST',
      toast: 'Команда добавлена',
    });
  }

  const winners = () => {
    api(`/tournament/${tournament.code}/process-iteration`, {
      method: 'POST',
      toast: 'Итерация обработана',
    });
  }

  return (
    <Banner title='Регламент турнира'>
      <Button variant='glass' onClick={insertTeam}>+1 команда</Button>
      <Button variant='glass' onClick={generateIteration}>Догенерировать итерацию</Button>
      <Button variant='glass' onClick={winners}>Определить пропердителей последней итерации</Button>
    </Banner>
  );
}