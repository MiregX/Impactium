'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { Description } from './components/Description';
import { Comments } from "@/components/Comments";
import { useTeam } from './team.context';
import { MembersForTeam } from './components/MembersForTeam';
import { Combination } from '@/ui/Combitation';
import { Badge } from '@/ui/Badge';
import { getReadableDate } from '@/decorator/getReadableDate';

export default function TeamIndentPage() {
  const { team } = useTeam();
  console.log(team)

  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <div className={s.heading}>
          <Combination size='heading' src={team.logo} name={team.title} id={team.indent} />
          Время регистрации {getReadableDate(team.registered)}
        </div>
        <MembersForTeam />
      </div>
      <Comments comments={team.comments} />
    </PanelTemplate>
  );
}
