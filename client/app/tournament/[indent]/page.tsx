'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { useTournament } from './context';
import { Description } from '@/app/team/[indent]/components/Description';
import { Heading } from '@/app/team/[indent]/components/Heading';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <Heading state={tournament} />
        <Description key='tournament' state={tournament} />
      </div>
    </PanelTemplate>
  );
}