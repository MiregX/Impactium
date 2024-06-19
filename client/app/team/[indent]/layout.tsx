import { TeamProvider } from "@/context/Team";
import { Team } from "@/dto/Team";
import { UseIndent } from "@/dto/UseIndent";
import { _server } from "@/dto/master";
import { redirect } from "next/navigation";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  const { indent, result: team } = await UseIndent<Team>(params, 'team');

  return (
    <TeamProvider prefetched={team}>
      {children}
    </TeamProvider>
  );
}