'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { useTournament } from './context';
import { Description } from '@/components/Description';
import { Heading } from '@/components/Heading';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate style={[s.page]}>
      <div className={s.wrapper}>
        <Heading state={tournament} />
        <Description key='tournament' state={tournament} />
      </div>
    </PanelTemplate>
  );
}