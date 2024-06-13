'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/main/PanelTempate";
import { useTournament } from './context';
import { Description } from '@/components/owerviewPageTemplate/Description';
import { Members } from '@/components/owerviewPageTemplate/Members';
import { Heading } from '@/components/owerviewPageTemplate/Heading';
import { Panel } from '@/ui/Panel';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading state={tournament} />
        <Description key='tournament' state={tournament} />
        <Members state={tournament} />
      </div>
      <Panel heading={'hi'}>
        <>
          <div>Mark</div>
          <div>Valentin</div>
          <div>Taras</div>
          <div>Putin</div>
        </>
      </Panel>
    </PanelTemplate>
  );
}