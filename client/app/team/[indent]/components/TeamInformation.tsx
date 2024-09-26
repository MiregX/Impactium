import { Card } from '@/ui/Card';
import s from '../Team.module.css';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { useTeam } from '../team.context';
import { Separator } from '@/ui/Separator';
import { Button } from '@/ui/Button';
import { useUser } from '@/context/User.context';
import { useEffect, useMemo, useState } from 'react';
import { isUserAreTeamOwner, isUserAdmin, isUserAreTeamMember, isUserCanJoinTeam } from '@/lib/utils';
import { useApplication } from '@/context/Application.context';
import { Joinable } from '@/dto/Joinable.dto';
import { TeamInvitesBanner } from '@/banners/qrcode/TeamInvites.banner';
import { TeamInviteBanner } from '@/banners/qrcode/TeamInvite.banner';
import { TeamInvite } from '@/dto/TeamInvite.dto';

export function TeamInformation() {
  const { spawnBanner, application } = useApplication();
  const { user } = useUser();
  const { team, setTeam } = useTeam();
  const [loading, setLoading] = useState<boolean>(false);

  const requestQRCode = useMemo(() => async () => {
    if (!isUserAreTeamOwner(user, team) && !isUserAdmin(user)) return;

    if (team.joinable === Joinable.Invites) {
      if (!team.invites) {
        const invites = await api<TeamInvite[]>(`/team/${team.indent}/invite/list`, { setLoading });
        setTeam(team => ({
          ...team,
          invites
        }));
        
        return spawnBanner(<TeamInvitesBanner team={team} setTeam={setTeam} invites={invites} />);
      }
      spawnBanner(<TeamInvitesBanner team={team} setTeam={setTeam} />);
    } else {
      spawnBanner(<TeamInviteBanner team={team} setTeam={setTeam} />);
    }
  }, [team, user]);

  const InviteMemberButton = () => team.joinable === Joinable.Closed
    ? null
    : <Button onClick={requestQRCode} loading={loading} img='QrCode'>Invite member</Button>;

  const LeaveTeamButton = () => <Button img='LogOut'>Leave team</Button>;

  const JoinTeamButton = () => <Button img='UserPlus'>Join team</Button>;

  const AccentButton = () => {
    if (isUserAreTeamOwner(user, team) || isUserAdmin(user))
      return <InviteMemberButton />;

    if (isUserAreTeamMember(user, team))
      return <LeaveTeamButton />;

    if (isUserCanJoinTeam(team))
      return <JoinTeamButton />;
  };

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
        <AccentButton />
        <Button variant='ghost'>Связь с командой</Button>
      </div>
    </Card>
  )
}
