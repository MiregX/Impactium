'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { Comments } from "@/components/team/Comments";
import { useTournament } from './context';
import { Description } from '@/components/owerviewPageTemplate/Description';
import { Members } from '@/components/owerviewPageTemplate/Members';
import { Heading } from '@/components/owerviewPageTemplate/Heading';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading state={tournament} />
        <Description key={'tournament'} state={tournament} />
        <Members state={tournament} />
      </div>
      <Comments />
    </PanelTemplate>
  );
}