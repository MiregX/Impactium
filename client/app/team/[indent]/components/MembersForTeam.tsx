'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import s from '../Team.module.css';
import React from "react";
import { MainRole, Role, RoleIcons, SecondaryRole } from "@/dto/Role";
import { Combination } from "@/ui/Combitation";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger } from "@/ui/Select";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";
import { capitalize } from "@impactium/utils";
import { TeamMember, TeamMemberSetRoleRequest } from "@/dto/TeamMember";
import { Team } from "@/dto/Team";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team, setTeam } = useTeam();

  const setMemberRole = (member: TeamMember, role: Role | null) => {
    api<Team>(`/team/${team.indent}/set/member-role`, {
      method: 'PUT',
      toast: 'member_updated_successfully',
      body: TeamMemberSetRoleRequest(member.id, role),
    }, team => team && setTeam(team));
  }

  const kickMember = (member: TeamMember) => {
    api<Team>(`/team/${team.indent}/kick/${member.id}`, {
      method: 'DELETE',
      toast: 'member_kicked'
    }, team => team && setTeam(team));
  }

  return (
    <div className={s.members_wrapper}>
      <div className={s.heading}>
        <h3>{lang.team.members}<span>{(team.members?.length || 0)} / 8 участников</span></h3>
        {user?.uid === team.ownerId
          ? <Button variant='secondary' img='PenLine'>Edit team</Button>
          : team.members?.find(m => m.uid === user?.uid)
            ? <Button variant='secondary' img='UserMinus'>Leave team</Button>
            : (team.members?.length || 0) < 8
              ? <Button variant='secondary' img='UserPlus'>Join team</Button>
              : null
        }
      </div>
      <Card className={s.members_for_team}>
        {team.members && team.members.map((member) => (
          <div key={member.id} className={s.role_unit}>
            <Combination src={member.user.avatar} name={member.user.displayName} id={member.user.username} />
            <Select value={member.role || undefined} defaultValue={member.role || undefined}>
              <SelectTrigger>
                <Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} />{member.role ? capitalize(member.role) : 'Нет роли'}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Основые роли
                  </SelectLabel>
                  {MainRole.map(role => <Button onClick={() => setMemberRole(member, role)} img={RoleIcons[role]} variant='ghost'>{role}</Button>)}
                </SelectGroup>
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Вторичные роли
                  </SelectLabel>
                  {SecondaryRole.map(role => <Button onClick={() => setMemberRole(member, role)} img={RoleIcons[role]} variant='ghost'>{role}</Button>)}
                  <Button variant='ghost' onClick={() => setMemberRole(member, null)} img='BoxSelect'>Без роли</Button>
                  <Button variant='destructive' onClick={() => kickMember(member)} img='UserX'>Исключить</Button>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ))}
      </Card>
    </div>
  );
};
