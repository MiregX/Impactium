'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Description } from '@/components/owerviewPageTemplate/Description';
import { Heading } from '@/components/owerviewPageTemplate/Heading';
import { Comments } from "@/components/team/Comments";
import { useTeam } from '@/context/Team';
import { MembersForTeam } from './components/MembersForTeam';

export default function TeamIndentPage() {
  const { team } = useTeam();
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading state={team} />
        <Description key='team' state={team} />
        <MembersForTeam />
      </div>
      <Comments />
    </PanelTemplate>
  );
}