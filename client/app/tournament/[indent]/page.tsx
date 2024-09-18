'use client'
import s from './Tournament.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { useTournament } from './context';
import { Description } from './components/Description';
import { Combination } from '@/ui/Combitation';
import { Card } from '@/ui/Card';
import { Grid } from './components/Grid';

export default function TeamIndentPage() {
  const { tournament } = useTournament();
  return (
    <PanelTemplate className={s.page}>
      <Card className={s.heading}>
        <Combination size='heading' src={tournament.banner} name={tournament.title} id={tournament.code} />
        <Description />
      </Card>
      <Grid length={64} />
    </PanelTemplate>
  );
}