import { TeamProvider } from "@/context/Team";
import { _server } from "@/dto/master";
import { redirect } from "next/navigation";

export default async function TeamIndentLayout({ params, children }: { params: { indent: string }, children: React.ReactNode }) {
  if (!params.indent.startsWith('%40')) {
    redirect(`/team/@${params.indent}`);
  } else {
    params.indent = params.indent.replace('%40', '@');
  }

  const team = await fetch(`${_server()}/api/team/get/${params.indent.replace('@', '')}`, {
    method: 'GET',
    cache: 'no-cache'
  })
    .then(async (response) => {
      console.log('Fetch success', response.body);
      return response.ok ? await response.json() : null
    })
    .catch(_ => {
      console.log('Fetch success', _);
      return undefined
    });

  if (!team) redirect('/teams');

  return (
    <TeamProvider prefetched={team}>
      {children}
    </TeamProvider>
  );
}