'use client'
import { useLanguage } from "@/context/Language";
import { useTeam } from "@/context/Team";
import { Panel } from "@/ui/Panel";
import s from '../Team.module.css';
import React from "react";
import { TeamMember } from "@/dto/TeamMember";
import { Avatar } from "@/components/avatar/Avatar";
import { TeamMemberRoles } from "@/dto/TeamMemberRoles";

export function MembersForTeam() {
  const { lang } = useLanguage();
  const { team } = useTeam();

  return (
    <Panel heading={lang.team.members}>
      <React.Fragment>
        {team.members && team.members.map((member: TeamMember, index: number) => (
          <div key={index} className={s.unit}>
            <Avatar
              size={32}
              src={member.user.login.avatar}
              alt={useUsername(member.user)} />
            <p>{useDisplayName(member.user)}</p>
            <p>{member.roles.map((role: TeamMemberRoles, index: number) => (
              <i key={index}><img src={`https://cdn.impactium.fun/roles/${role}.svg`} />{role}</i>
            ))}</p>
          </div>
        ))}
      </React.Fragment>
    </Panel>
  )
}
