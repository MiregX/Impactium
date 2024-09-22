import { TeamProvider } from "./team.context";
import { Team } from "@/dto/Team";
import { useIndent } from "@/decorator/useIndent";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  const { indent, result: team } = await useIndent<Team>(params, 'team');

  return (
    <TeamProvider prefetched={team}>
      {children}
    </TeamProvider>
  );
}
