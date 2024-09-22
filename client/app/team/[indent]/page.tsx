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
import { Card } from '@/ui/Card';
import { Badge, BadgeType } from '@/ui/Badge';
import { TeamInformation } from './components/TeamInformation';

export default function TeamIndentPage() {
  const { team } = useTeam();
  const { user } = useUser();

  const handle = () => {

  }

  const isCurrentUserOwner = user?.uid === team.ownerId;

  return (
    <PanelTemplate className={s.page}>
      <Card className={s.header}>
        <Combination size='heading' className={cn(isCurrentUserOwner && s.combination)} onClick={() => isCurrentUserOwner && handle()} src={team.logo} name={team.title} id={team.indent} />
        <Badge type={BadgeType.Registered} title={getReadableDate(team.registered)} />  
      </Card>
      <MembersForTeam />
      <TeamInformation />
    </PanelTemplate>
  );
}
