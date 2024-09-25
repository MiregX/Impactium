'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import s from '../Team.module.css';
import React, { useMemo, useState } from "react";
import { MainRole, Role, RoleIcons, SecondaryRole, SortRoles } from "@/dto/Role";
import { Combination } from "@/ui/Combitation";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger } from "@/ui/Select";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";
import { capitalize } from "@impactium/utils";
import { TeamMember, TeamMemberSetRoleRequest } from "@/dto/TeamMember";
import { Team } from "@/dto/Team";
import { isUserAdmin, isUserAreTeamMember, isUserAreTeamOwner, isUserCanJoinTeam, SetState } from "@/lib/utils";
import { useApplication } from "@/context/Application.context";
import { EditTeamBanner } from "@/banners/edit_team/EditTeam.banner";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team, setTeam } = useTeam();
  const { spawnBanner } = useApplication();

  const setMemberRole = (member: TeamMember, role: Role | null, state: SetState<boolean>) => {
    state(false);

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

  const spawnEditTeamBanner = () => spawnBanner(<EditTeamBanner team={team} />)

  const EditTeamButton = useMemo(() => <Button variant='secondary' onClick={spawnEditTeamBanner} img='PenLine'>Edit team</Button>, [user, team]);

  const LeaveTeamButton = useMemo(() => <Button variant='secondary' img='UserMinus'>Leave team</Button>, [user, team]);

  const JoinTeamButton = useMemo(() => <Button variant='secondary' img='UserPlus'>Join team</Button>, [user, team]);

  const AccentButton = useMemo(() => {
    if (isUserAreTeamOwner(user, team) || isUserAdmin(user))
      return EditTeamButton;

    if (isUserAreTeamMember(user, team))
      return LeaveTeamButton;

    if (isUserCanJoinTeam(team))
      return JoinTeamButton;
  }, [user, team]);

  return (
    <div className={s.members_wrapper}>
      <div className={s.heading}>
        <h3>{lang.team.members}<span>{(team.members?.length || 0)} / 7 участников</span></h3>
        {AccentButton}
      </div>
      <Card className={s.members_for_team}>
        {team.members && team.members.sort((a, b) => SortRoles(a.role, b.role)).map((member) => {
          const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false);
          return (
          <div key={member.id} className={s.role_unit}>
            <Combination src={member.user.avatar} name={member.user.displayName} id={member.user.username} />
            <Select open={isSelectOpen} onOpenChange={setIsSelectOpen} value={member.role || undefined} defaultValue={member.role || undefined}>
              <SelectTrigger className={s.trigger}>
                <Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} /><i>{member.role ? capitalize(member.role) : 'Нет роли'}</i>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Основые роли
                  </SelectLabel>
                  {MainRole.map(role => <Button key={role} onClick={() => setMemberRole(member, role, setIsSelectOpen)} img={RoleIcons[role]} variant={team.members?.some(m => m.role === role) ? 'disabled' : 'ghost'}>{role}</Button>)}
                </SelectGroup>
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Вторичные роли
                  </SelectLabel>
                  {SecondaryRole.map(role => <Button key={role} onClick={() => setMemberRole(member, role, setIsSelectOpen)} img={RoleIcons[role]} variant={team.members?.some(m => m.role === role) ? 'disabled' : 'ghost'}>{role}</Button>)}
                  <Button variant='ghost' onClick={() => setMemberRole(member, null, setIsSelectOpen)} img='BoxSelect'>Без роли</Button>
                  <Button variant='destructive' onClick={() => kickMember(member)} img='UserX'>Исключить</Button>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )})}
      </Card>
    </div>
  );
};
