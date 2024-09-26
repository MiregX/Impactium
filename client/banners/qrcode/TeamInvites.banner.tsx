'use client'
import { useApplication } from "@/context/Application.context";
import { Team } from "@/dto/Team";
import { TeamInvite } from "@/dto/TeamInvite.dto";
import { cn, SetState } from "@/lib/utils";
import { Banner } from "@/ui/Banner";
import { Button } from "@/ui/Button";
import s from './TeamInvites.module.css';
import { useState } from "react";
import QRCodeGenerator from 'react-qr-code';
import React from "react";
import { Separator } from "@/ui/Separator";
import { TeamInviteBanner } from "./TeamInvite.banner";
import { NewTeamInviteBanner } from "./NewTeamInvite.banner";

interface TeamInvitesBannerProps {
  team: Team;
  setTeam: SetState<Team>;
  invites?: TeamInvite[];
}

export function TeamInvitesBanner({ team, setTeam, invites = team.invites }: TeamInvitesBannerProps) {
  const { application, spawnBanner } = useApplication();
  
  const url = (id: string) => `${process.env.NODE_ENV === 'production' ? application.localhost[2] : 'http://localhost:3000'}/team/${team.indent}/join/${id}`;

  return (
    <Banner title='Приглашения'>
      <p>Приглашений {invites?.length || 0} / 5</p>
      <div className={s.list}>
        {invites?.length
          ? invites?.map(invite => (
            <React.Fragment key={invite.id}>
              <div className={s.invite}>
                <QRCodeGenerator
                  size={36}
                  value={url(invite.id)}
                  className={cn(s.qrcode, s.mini)}
                  bgColor={'#0000'}
                  fgColor={'var(--meta-black)'}
                  viewBox='0 0 256 256' />
                <div className={s.text}>
                  <p>{invite.id}</p>
                  <span>Использовано {invite.used} / {invite.maxUses}</span>
                </div>
                <Button
                  variant='ghost'
                  img='MoveRight'
                  revert
                  onClick={() => spawnBanner(<TeamInviteBanner team={team} setTeam={setTeam} invite={invite} />)}>Подробнее</Button>
              </div>
              <Separator />
            </React.Fragment>))
          : <span>У команды нет приглашений</span>}
      </div>
      <Button onClick={() => spawnBanner(<NewTeamInviteBanner team={team} setTeam={setTeam} />)} variant={(invites?.length || 0) >= 5 ? 'disabled' : 'default'} className={s.new_invite} img='Plus'>Новое приглашение</Button>
    </Banner>
  )
}