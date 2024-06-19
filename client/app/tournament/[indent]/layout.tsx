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
    title: 'International 2043',
    winer: 'Team Impactium',
    moderators: ['1', '2'],
    indent:'international_qs52',
    logo:'https://cdn.impactium.fun/logo/impactium.svg',
    ownerId:'clx1npprb0000adbr43puzebo',
    description:'Пельмени – знаменитое блюдо русской кухни, имеющее древние китайские, финно-угорские, тюркские и славянские корни. Современное название происходит от удмуртского «пельнянь» – «хлебное ухо». Аналоги пельменей существуют во многих кухнях мира. Вкус, сытность и удобство хранения сделали пельмени исключительно популярными, готовые пельмени можно купить в любом продуктовом магазине. Но, конечно, самые вкусные пельмени – домашние. Для того, чтобы приготовить вкусные пельмени, прежде всего нужен хороший рецепт теста для пельменей, рецепт фарша для пельменей и немного умения. Хорошие рецепты домашних пельменей, рецепты теста для пельменей, рецепты фарша для пельменей, а также ответы на вопросы: как лепить пельмени, как варить пельмени, сколько варить пельмени, как пожарить пельмени на сковороде, как запечь пельмени в духовке, как приготовить пельмени в горшочке, ленивые пельмени, вы найдете на нашем сайте.',
    membersAmount:10,
    comments:[]
  } as Tournament

  if (!tournament) redirect('/tournaments');

  return (
    <TournamentProvider prefetched={tournament}>
      {children}
    </TournamentProvider>
  );
}