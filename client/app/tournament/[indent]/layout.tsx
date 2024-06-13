import { Tournament } from "@/dto/Tournament";
import { TournamentProvider } from "./context";
import { _server } from "@/dto/master";
import { redirect } from "next/navigation";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  if (!params.indent.startsWith('%40')) {
    redirect(`/tournament/@${params.indent}`);
  } else {
    params.indent = params.indent.replace('%40', '@');
  }

  const tournament = {
    title: 'inasrt2qwasfdshkfhgdst',
    winer: 'Imo123ewasdactium',
    moderators: ['1', '2'],
    indent:'huasdzfsxheawsgi',
    logo:'zx14qawsdasrc',
    ownerId:'asd12edsaf2',
    description:'yes21512wda',
    membersAmount:2,
    comments:[]
  } as Tournament

  if (!tournament) redirect('/tournaments');

  return (
    <TournamentProvider prefetched={tournament}>
      {children}
    </TournamentProvider>
  );
}