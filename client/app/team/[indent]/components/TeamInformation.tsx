import { Card } from '@/ui/Card';
import s from '../Team.module.css';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { useTeam } from '../team.context';
import { Separator } from '@/ui/Separator';
import { Button } from '@/ui/Button';
import { useUser } from '@/context/User.context';
import { useMemo, useState } from 'react';
import { isUserAreTeamOwner, isUserAdmin, isUserAreTeamMember, isUserCanJoinTeam } from '@/lib/utils';
import { QRCode } from '@/dto/QRCode.dto';
import { useApplication } from '@/context/Application.context';
import { QRCodeBanner } from '@/banners/qrcode/QRCodeBanner';
import { Joinable } from '@/dto/Joinable.dto';
import { Badge, BadgeType } from '@/ui/Badge';
import { useLanguage } from '@/context/Language.context';
import { getReadableDate } from '@/decorator/getReadableDate';

export function TeamInformation() {
  const { spawnBanner, application } = useApplication();
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team } = useTeam();
  const [QRCode, setQRCode] = useState<QRCode | null>(null);

  const requestQRCode = useMemo(() => async () => {
    if (!isUserAreTeamOwner(user, team) && !isUserAdmin(user)) return;

    if (team.joinable === Joinable.Free) return spawnBanner(<QRCodeBanner QRCode={{
      url: `${process.env.NODE_ENV === 'production' ? application.localhost[2] : 'http://localhost:3000'}/team/${team.indent}/join`,
      expires: Infinity,
    }} />);

    const QRCode = await api<QRCode>(`/team/${team.indent}/qrcode`, {
      method: 'GET',
      toast: true
    })

    if (QRCode) {
      spawnBanner(<QRCodeBanner QRCode={QRCode} />)
    }
  }, [team, user]);
  
  const InviteMemberButton = useMemo(() => {
    if (team.joinable === Joinable.Closed) return null;

    return <Button onClick={requestQRCode} img='QrCode'>Invite member</Button>
  }, [user, team.joinable]);

  const LeaveTeamButton = useMemo(() => <Button img='LogOut'>Leave team</Button>, [user, team]);

  const JoinTeamButton = useMemo(() => <Button img='UserPlus'>Join team</Button>, [user, team]);

  const AccentButton = useMemo(() => {
    if (isUserAreTeamOwner(user, team) || isUserAdmin(user))
      return InviteMemberButton;

    if (isUserAreTeamMember(user, team))
      return LeaveTeamButton;

    if (isUserCanJoinTeam(team))
      return JoinTeamButton;
  }, [user, team]);

  return (
    <Card className={s.information}>
      <h3>Основная информация</h3>
      <div className={s.node}>
        <p>Владелец:</p>
        {team.owner ? <Combination id={team.owner.uid} src={team.owner.avatar} name={team.owner.displayName} /> : <CombinationSkeleton />}
      </div>
      <div className={s.pod}>
        <p>Выиграно турниров: {team.tournaments?.length}</p>
        <span></span>
      </div>
      <Separator />
      <div className={s.tournaments}>
        {team.tournaments?.length
          ? team.tournaments.map(tournament => <Combination key={tournament.code} id={tournament.code} src={tournament.banner} name={tournament.title} />)
          : <span>Команда не учавствовала в турнирах</span>
        }
      </div>
      <Separator />
      <div className={s.group}>
        {AccentButton}
        <Button variant='ghost'>Связь с командой</Button>
      </div>
    </Card>
  )
}
