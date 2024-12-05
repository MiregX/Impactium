import { Card } from '@/ui/Card';
import s from '../Team.module.css';
import { Combination, CombinationSkeleton } from '@/ui/Combitation';
import { useTeam } from '../team.context';
import { Separator } from '@/ui/Separator';
import { Button } from '@impactium/components';
import { useUser } from '@/context/User.context';
import { useMemo, useState } from 'react';
import { useApplication } from '@/context/Application.context';
import { Joinable } from '@/dto/Joinable.dto';
import { TeamInvitesBanner } from '@/banners/qrcode/TeamInvites.banner';
import { TeamInviteBanner } from '@/banners/qrcode/TeamInvite.banner';
import { TeamInvite } from '@/dto/TeamInvite.dto';
import { UserCombination } from '@/components/UserCombination';
import { isUserAreTeamMember, isUserAreTeamOwner, isUserCanJoinTeam } from '@/lib/utils';

export function TeamInformation() {
  const { spawnBanner } = useApplication();
  const { user } = useUser();
  const { team, setTeam, leave, join } = useTeam();
  const [loading, setLoading] = useState<boolean>(false);

  const requestQRCode = useMemo(() => async () => {
    if (!isUserAreTeamOwner(user, team)) return;

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

  const LeaveTeamButton = () => <Button onClick={leave} img='LogOut'>Leave team</Button>;

  const JoinTeamButton = () => <Button onClick={join} img='UserPlus'>Join team</Button>;

  const AccentButton = () => {
    if (isUserAreTeamOwner(user, team))
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
        <UserCombination user={team.owner} />
      </div>
      <div className={s.pod}>
        <p>Выиграно турниров: {team.tournaments?.filter(tournament => tournament.winner === team.indent).length}</p>
      </div>
      <Separator />
      <div className={s.tournaments}>
        {team.tournaments?.length
          ? team.tournaments.map(tournament => (
              <div className={s.participated_tournaments}>
                <Combination key={tournament.code} id={tournament.code} src={tournament.banner} name={tournament.title} />
                <Button variant='ghost'>Топ 8</Button>
              </div>
            ))
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
