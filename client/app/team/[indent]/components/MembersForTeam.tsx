'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import s from '../Team.module.css';
import React, { useState } from "react";
import { MainRole, Role, RoleIcons, SecondaryRole, SortRoles } from "@/dto/Role";
import { Combination } from "@/ui/Combitation";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger } from "@/ui/Select";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";
import { capitalize } from "@impactium/utils";
import { TeamMember } from "@/dto/TeamMember";
import { isUserAdmin, isUserAreTeamMember, isUserAreTeamOwner, isUserCanJoinTeam, SetState } from "@/lib/utils";
import { useApplication } from "@/context/Application.context";
import { EditTeamBanner } from "@/banners/edit_team/EditTeam.banner";
import { Separator } from "@/ui/Separator";
import { Team } from "@/dto/Team";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team, setTeam } = useTeam();
  const { spawnBanner } = useApplication();

  const [isSelectOpenArray, setIsSelectOpenArray] = useState<boolean[]>(new Array(team.members?.length).fill(false));

  const setMemberRole = (uid: TeamMember['uid'], role: Role | null, state: SetState<boolean>) => {
    state(false);

    api<Team>(`/team/${team.indent}/set/role`, {
      method: 'PUT',
      toast: 'member_updated_successfully',
      body: JSON.stringify({ uid, role }),
    }, team => team && setTeam(team));
  }

  const kickMember = (uid: TeamMember['uid']) => api<Team>(`/team/${team.indent}/kick/${uid}`, {
    method: 'DELETE',
    toast: 'member_kicked'
  }, team => team && setTeam(team));

  const joinMember = () => api<Team>(`/team/${team.indent}/join`, {
    method: 'POST',
  }, team => setTeam(team));

  const leave = () => api<Team>(`/team/${team.indent}/leave`, {
    method: 'DELETE',
  }, team => setTeam(team));

  const spawnEditTeamBanner = () => spawnBanner(<EditTeamBanner team={team} setTeam={setTeam} />)

  const EditTeamButton = <Button variant='secondary' onClick={spawnEditTeamBanner} img='PenLine'>Edit team</Button>;

  const LeaveTeamButton = <Button variant='secondary' onClick={leave} img='LogOut'>Leave team</Button>

  const JoinTeamButton = <Button variant='secondary' onClick={joinMember} img='UserPlus'>Join team</Button>

  const AccentButton = () => {
    if (isUserAreTeamOwner(user, team) || isUserAdmin(user))
      return EditTeamButton;

    if (isUserAreTeamMember(user, team))
      return LeaveTeamButton;

    if (isUserCanJoinTeam(team))
      return JoinTeamButton;
  }

  const handleSelectOpenChange = (index: number, isOpen: boolean) => {
    const newIsSelectOpenArray = [...isSelectOpenArray];
    newIsSelectOpenArray[index] = isOpen;
    setIsSelectOpenArray(newIsSelectOpenArray);
  };

  return (
    <div className={s.members_wrapper}>
      <div className={s.heading}>
        <h3>{lang.team.members}<span>{(team.members?.length || 0)} / 7 участников</span></h3>
        <AccentButton />
      </div>
      <Card className={s.members_for_team}>
        {team.members && team.members.sort((a, b) => SortRoles(a.role, b.role)).map((member, index) => (
          <div key={member.id} className={s.role_unit}>
            <Combination src={member.user.avatar} name={member.user.displayName} id={member.user.username} />
            {(isUserAdmin(user) || isUserAreTeamOwner(user, team) || user?.uid === member.uid) ? <Select open={isSelectOpenArray[index]} onOpenChange={(isOpen) => handleSelectOpenChange(index, isOpen)} value={member.role || undefined} defaultValue={member.role || undefined}>
              <SelectTrigger className={s.trigger}>
                <Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} /><i>{member.role ? capitalize(member.role) : 'Нет роли'}</i>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Основые роли
                  </SelectLabel>
                  {MainRole.filter(role => team.members?.every(member => member.role !== role)).map(role => <Button key={role} onClick={() => setMemberRole(member.uid, role, () => handleSelectOpenChange(index, false))} img={RoleIcons[role]} variant={team.members?.some(m => m.role === role) ? 'disabled' : 'ghost'}>{role}</Button>)}
                </SelectGroup>
                <Separator />
                <SelectGroup className={s.cluster}>
                  <SelectLabel>
                    Вторичные роли
                  </SelectLabel>
                  {SecondaryRole.filter(role => team.members?.every(member => member.role !== role)).map(role => <Button key={role} onClick={() => setMemberRole(member.uid, role, () => handleSelectOpenChange(index, false))} img={RoleIcons[role]} variant={team.members?.some(m => m.role === role) ? 'disabled' : 'ghost'}>{role}</Button>)}
                  <Button variant='ghost' onClick={() => setMemberRole(member.uid, null, () => handleSelectOpenChange(index, false))} img='BoxSelect'>Без роли</Button>
                  {(isUserAdmin(user) || isUserAreTeamOwner(user, team)) && <Button variant='destructive' onClick={() => kickMember(member.uid)} img='UserX'>Исключить</Button>}
                </SelectGroup>
              </SelectContent>
            </Select> : <span className={s.role}><Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} /><i>{member.role ? capitalize(member.role) : 'Нет роли'}</i></span>}
          </div>
        ))}
      </Card>
    </div>
  );
}
