'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { Description } from './components/Description';
import { Comments } from "@/components/Comments";
import { useTeam } from './team.context';
import { MembersForTeam } from './components/MembersForTeam';
import { Combination } from '@/components/Combitation';

export default function TeamIndentPage() {
  const { team } = useTeam();

  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <Combination size='heading' src={team.logo} name={team.title} id={team.indent} />
        <Description key='team' state={team} />
        <MembersForTeam />
      </div>
      <Comments comments={team.comments} />
    </PanelTemplate>
  );
}
