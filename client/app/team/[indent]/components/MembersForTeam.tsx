'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import { Panel } from "@/ui/Panel";
import s from '../Team.module.css';
import React from "react";
import { TeamMemberMainRoles, TeamMemberMainRolesMap } from "@/dto/TeamMemberRoles";
import { Combination } from "@/ui/Combitation";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/ui/Tooltip";
import { Icon } from "@/ui/Icon";
import { icons } from "lucide-react";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team } = useTeam();

  const heading = (
    <div className={s.heading}>
      <h4>{lang.team.members}<span>{(team.members?.length || 0)} / 8 участников</span></h4>
      {user?.uid === team.ownerId
        ? <Button size='sm'>Edit team</Button>
        : team.members?.find(m => m.uid === user?.uid)
          ? <Button size='sm'>Leave team</Button>
          : (team.members?.length || 0) < 8
            ? <Button variant='ghost' size='sm'>Join team</Button>
            : null
      }      
    </div>
  );

  return (
    <Panel heading={heading} className={s.members_for_team}>
      {team.members && team.members.map(({ user, ...member }) => (
        <div key={member.id} className={s.role_unit}>
          <Combination src={user.avatar} name={user.displayName} id={user.username} />
          <div className={s.roles}>
            {Object.values(TeamMemberMainRoles)
              .filter((key): key is TeamMemberMainRoles => typeof key === 'number')
              .map((role) => (
                <TooltipProvider key={role}>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icon
                        name={TeamMemberMainRolesMap[role] as keyof typeof icons}
                        className={cn(s.icon, member.roles.includes(TeamMemberMainRolesMap[role]) && s.active)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{TeamMemberMainRolesMap[role]}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          </div>
        </div>
      ))}
    </Panel>
  );
};
