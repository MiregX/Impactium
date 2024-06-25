import { TeamProvider } from "@/context/Team";
import { Team } from "@/dto/Team";
import { UseIndent } from "@/decorator/useIndent";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  const { indent, result: team } = await UseIndent<Team>(params, 'team');

  return (
    <TeamProvider prefetched={team}>
      {children}
    </TeamProvider>
  );
}