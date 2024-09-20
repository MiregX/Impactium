import { Tournament } from "@/dto/Tournament";
import { Banner } from "@/ui/Banner";

interface TournamentRulesProps {
  tournament: Tournament;
}

export function TournamentRules({ tournament }: TournamentRulesProps) {
  return (
    <Banner title='Регламент турнира'>
      {null}
    </Banner>
  );
}