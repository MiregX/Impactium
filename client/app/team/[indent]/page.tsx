'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { Description } from '@/app/team/[indent]/components/Description';
import { TeamHeading } from '@/app/team/[indent]/components/TeamHeading';
import { Comments } from "@/components/Comments";
import { useTeam } from './team.context';
import { MembersForTeam } from './components/MembersForTeam';

export default function TeamIndentPage() {
  const { team } = useTeam();

  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <TeamHeading team={team} />
        <Description key='team' state={team} />
        <MembersForTeam />
      </div>
      <Comments comments={team.comments} />
    </PanelTemplate>
  );
}
