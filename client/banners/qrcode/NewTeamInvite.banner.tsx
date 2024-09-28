'use client'
import { useApplication } from "@/context/Application.context";
import { NewTeamInviteRequest } from "@/dto/NewTeamInvite.request";
import { Team } from "@/dto/Team";
import { TeamInvite } from "@/dto/TeamInvite.dto";
import { SetState } from "@/lib/utils";
import { Banner } from "@/ui/Banner";
import { Button } from "@/ui/Button";
import { ChangeEvent, useState } from "react";
import { TeamInviteBanner } from "./TeamInvite.banner";
import { Input } from "@/ui/Input";
import s from './TeamInvites.module.css';

interface NewTeamInviteBannerProps {
  team: Team;
  setTeam: SetState<Team>;
}

export function NewTeamInviteBanner({ team, setTeam }: NewTeamInviteBannerProps) {
  const [maxUses, setMaxUses] = useState<number>(4);
  const [loading, setLoading] = useState<boolean>(false);
  const { spawnBanner } = useApplication();
  const [valid, setValid] = useState<boolean>(true);

  const create = () => {
    if (maxUses > 10 || maxUses < 1) return setValid(false);

    api<TeamInvite>(`/team/${team.indent}/invite/new`, {
      method: 'POST',
      body: NewTeamInviteRequest.create({ maxUses }),
      setLoading
    }).then(invite => {
      const invites = Array.isArray(team.invites) ? team.invites : [];
      setTeam(team => ({
        ...team,
        invites: [...invites, invite]
      }));

      team.invites = [...invites, invite];

      spawnBanner(<TeamInviteBanner team={team} setTeam={setTeam} invite={invite} />)
    });
  }

  const handleMaxUsesInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValid(true);
    setMaxUses(parseInt(event.target.value));
  }

  return (
    <Banner title='Новое приглашение' className={s.new_invite_banner}>
      <Input valid={valid} img='TicketPercent' type='number' value={maxUses} onChange={handleMaxUsesInput} />
      <Button loading={loading} img='Plus' onClick={create}>Создать приглашение</Button>
    </Banner>
  )
}