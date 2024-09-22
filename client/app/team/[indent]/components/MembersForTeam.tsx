'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import s from '../Team.module.css';
import React from "react";
import { MainRoles, RolesIcons, SecondaryRoles } from "@/dto/Roles";
import { Combination } from "@/ui/Combitation";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/ui/Select";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";
import { capitalize } from "@impactium/utils";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team } = useTeam();

  const Heading = () => (
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
    <Card className={s.members_for_team}>
      <Heading />
      {team.members && team.members.map(({ user, ...member }) => (
        <div key={member.id} className={s.role_unit}>
          <Combination src={user.avatar} name={user.displayName} id={user.username} />
          <Select>
            <SelectTrigger>
              <Icon name={'AArrowDown'} />{capitalize(member.roles[0])}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  Основые роли
                </SelectLabel>
                {MainRoles.map(role => (
                  <SelectItem value={role}>
                    <Icon name={RolesIcons[role]} />{role}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>
                  Вторичные роли
                </SelectLabel>
                {SecondaryRoles.map(role => (
                  <SelectItem value={role}>
                    <Icon name={RolesIcons[role]} />{role}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      ))}
    </Card>
  );
};
