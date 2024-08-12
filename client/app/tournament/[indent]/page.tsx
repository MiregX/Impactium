'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { useTournament } from './context';
import { Description } from './components/Description';
import { Combination } from '@/ui/Combitation';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <Combination size='heading' src={tournament.banner} name={tournament.title} id={tournament.code} />
        <Description />
      </div>
    </PanelTemplate>
  );
}