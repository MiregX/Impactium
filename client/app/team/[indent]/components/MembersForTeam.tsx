'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import { Panel } from "@/ui/Panel";
import s from '../Team.module.css';
import React from "react";
import { Avatar } from "@/ui/Avatar";
import { TeamMemberRoles } from "@/dto/TeamMemberRoles";
import { Combination } from "@/ui/Combitation";

export function MembersForTeam() {
  const { lang } = useLanguage();
  const { team } = useTeam();

  return (
    <Panel heading={lang.team.members} className={s.members_for_team}>
      {team.members && team.members.map(({user, ...member }) => 
        <div key={member.id} className={s.role_unit}>
          <Combination src={user.avatar} name={user.displayName} id={user.username} />
          <div className={s.roles}>
            {member.roles.map((role: TeamMemberRoles, index: number) => (
              <i key={index}><img src={`https://cdn.impactium.fun/ui/roles/${role}.svg`} />{role}</i>
            ))}
          </div>
        </div>
      )}
    </Panel>
  )
}
