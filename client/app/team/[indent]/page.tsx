'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { Description } from '@/components/Description';
import { Heading } from '@/components/Heading';
import { Comments } from "@/components/Comments";
import { useTeam } from './team.context';
import { MembersForTeam } from './components/MembersForTeam';

export default function TeamIndentPage() {
  const { team } = useTeam();

  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <Heading state={team} />
        <Description key='team' state={team} />
        <MembersForTeam />
      </div>
      <Comments comments={[]} />
    </PanelTemplate>
  );
}
