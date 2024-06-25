import { Tournament } from "@/dto/Tournament";
import { TournamentProvider } from "./context";
import { UseIndent } from "@/decorator/useIndent";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  const { indent, result: tournament } = await UseIndent<Tournament>(params, 'tournament'); 

  return (
    <TournamentProvider prefetched={tournament}>
      {children}
    </TournamentProvider>
  );
}