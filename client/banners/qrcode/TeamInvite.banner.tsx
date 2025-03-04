import { Banner } from "@/ui/Banner";
import { Button } from "@impactium/components";
import { Separator } from "@/ui/Separator";
import QRCodeGenerator from 'react-qr-code';
import s from './TeamInvites.module.css';
import { cn } from "@impactium/utils";
import { type SetState } from '@impactium/types';
import { useLanguage } from "@/context/Language.context";
import React, { useState } from "react";
import { useApplication } from "@/context/Application.context";
import { Team } from "@/dto/Team.dto";
import { TeamInvite } from "@/dto/TeamInvite.dto";
import Countdown from "react-countdown";
import { TeamInvitesBanner } from "./TeamInvites.banner";
import { ManageTeamBanner } from "../ManageTeam.banner";
import { λcopy } from "@/lib/utils";

interface TeamInviteBannerProps {
  team: Team;
  setTeam: SetState<Team>;
  invite?: TeamInvite;
}

export function TeamInviteBanner({ team, setTeam, invite }: TeamInviteBannerProps) {
  const { lang } = useLanguage();
  const { spawnBanner, application } = useApplication();
  const [loading, setLoading] = useState<boolean>(false);

  const url = `${process.env.NODE_ENV === 'production' ? application.localhost[2] : 'http://localhost:3000'}/team/@${team.indent}/join${invite?.id ? `/${invite.id}` : ''}`;

  const spawnEditTeamBanner = () => spawnBanner(<ManageTeamBanner team={team} setTeam={setTeam} />);

  const deleteInvite = () => {
    api<TeamInvite[]>(`/team/${team.indent}/invite/delete/${invite!.id}`, {
      method: 'DELETE',
      setLoading
    }).then(invites => {
      setTeam(team => ({
        ...team,
        invites
      }))
      team.invites = invites;
      spawnBanner(<TeamInvitesBanner team={team} setTeam={setTeam} invites={invites} />);
    })
  }

  return (
    <Banner title={lang.team.invite} className={s.banner}>
      <QRCodeGenerator
        size={256}
        value={url}
        className={s.qrcode}
        bgColor={'#0000'}
        fgColor={'var(--meta-black)'}
        viewBox='0 0 256 256' />
      {invite && <div className={s.expires}>
        <p>Закончится через:</p>
        <Countdown date={new Date(invite.created).valueOf() + 1000 * 60 * 60 * 24 * 7} />
      </div>}
      <Separator><i>{lang.or}</i></Separator>
      <div className={s.general_buttons_group}>
        <Button className={s.button} img='Link' onClick={λcopy(url)}>{lang.copyUrl}</Button>
        {invite && <Button size='icon' loading={loading} variant='destructive' className={s.button} img='Trash2' onClick={deleteInvite} />}
      </div>
      <Button className={cn(s.button, s.settings)} onClick={spawnEditTeamBanner} variant='ghost'>{lang.team.settings}</Button>
      <span>{lang.warn_everyone_can_join}</span>
    </Banner>
  );
}
