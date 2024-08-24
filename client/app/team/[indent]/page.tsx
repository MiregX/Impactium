'use client'
import s from './Team.module.css'
import { PanelTemplate } from "@/components/PanelTempate";
import { Comments } from "@/components/Comments";
import { useTeam } from './team.context';
import { MembersForTeam } from './components/MembersForTeam';
import { Combination } from '@/ui/Combitation';
import { getReadableDate } from '@/decorator/getReadableDate';
import { useUser } from '@/context/User.context';
import { cn } from '@/lib/utils';

export default function TeamIndentPage() {
  const { team } = useTeam();
  const { user } = useUser();

  const handle = () => {

  }

  const isCurrentUserOwner = user?.uid === team.ownerId;

  return (
    <PanelTemplate className={s.page}>
      <div className={s.wrapper}>
        <div className={s.heading}>
          <Combination size='heading' className={cn(isCurrentUserOwner && s.combination)} onClick={() => isCurrentUserOwner && handle()} src={team.logo} name={team.title} id={team.indent} />
          Время регистрации {getReadableDate(team.registered)}
        </div>
        <MembersForTeam />
      </div>
      <Comments comments={team.comments} />
    </PanelTemplate>
  );
}
