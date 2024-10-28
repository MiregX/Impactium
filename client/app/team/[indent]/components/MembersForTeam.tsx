'use client'
import { useLanguage } from "@/context/Language.context";
import { useTeam } from "../team.context";
import s from '../Team.module.css';
import React, { useState } from "react";
import { MainRole, Role, RoleIcons, SecondaryRole, SortRoles } from "@/dto/Role";
import { Button } from "@/ui/Button";
import { useUser } from "@/context/User.context";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger } from "@/ui/Select";
import { Icon } from "@/ui/Icon";
import { Card } from "@/ui/Card";
import { TeamMember } from "@/dto/TeamMember";
import { isUserAreTeamMember, isUserAreTeamOwner, isUserCanJoinTeam, SetState } from "@/lib/utils";
import { useApplication } from "@/context/Application.context";
import { Separator } from "@/ui/Separator";
import { Team } from "@/dto/Team.dto";
import { ManageTeamBanner } from "@/banners/ManageTeam.banner";
import { UserCombination } from "@/components/UserCombination";
import { λUtils } from "@impactium/utils";

export function MembersForTeam() {
  const { user } = useUser();
  const { lang } = useLanguage();
  const { team, setTeam, leave, join } = useTeam();
  const { spawnBanner } = useApplication();

  const [isSelectOpenArray, setIsSelectOpenArray] = useState<boolean[]>(new Array(team.members?.length).fill(false));

  const setMemberRole = (uid: TeamMember['uid'], role: Role | null, state: SetState<boolean>) => {
    state(false);

    api<Team>(`/team/${team.indent}/set/role`, {
      method: 'PUT',
      toast: 'member_updated_successfully',
      body: { uid, role },
    }, team => team && setTeam(team));
  }

  const kickMember = (uid: TeamMember['uid']) => api<Team>(`/team/${team.indent}/kick/${uid}`, {
    method: 'DELETE',
    toast: 'member_kicked'
  }, team => team && setTeam(team));

  const spawnEditTeamBanner = () => spawnBanner(<ManageTeamBanner team={team} setTeam={setTeam} />)

  const LeaveTeamButton = <Button variant='secondary' onClick={leave} img='LogOut'>Leave team</Button>

  const JoinTeamButton = <Button variant='secondary' onClick={join} img='UserPlus'>Join team</Button>

  const AccentButton = () => {
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
        {isUserAreTeamOwner(user, team) && <Button variant='secondary' onClick={spawnEditTeamBanner} img='PenLine'>Edit team</Button>}
        <AccentButton />
      </div>
      <Card className={s.members_for_team}>
        {team.members && team.members.sort((a, b) => SortRoles(a.role, b.role)).map((member, index) => (
          <div key={member.id} className={s.role_unit}>
            <UserCombination user={member.user} />
            {(isUserAreTeamOwner(user, team) || user?.uid === member.uid) ? <Select open={isSelectOpenArray[index]} onOpenChange={(isOpen) => handleSelectOpenChange(index, isOpen)} value={member.role || undefined} defaultValue={member.role || undefined}>
              <SelectTrigger className={s.trigger}>
                <Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} /><i>{member.role ? λUtils.capitalize(member.role) : 'Нет роли'}</i>
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
                  {(isUserAreTeamOwner(user, team)) && <Button variant='destructive' onClick={() => kickMember(member.uid)} img='UserX'>Исключить</Button>}
                </SelectGroup>
              </SelectContent>
            </Select> : <span className={s.role}><Icon name={member.role ? RoleIcons[member.role] : 'BoxSelect'} /><i>{member.role ? λUtils.capitalize(member.role) : 'Нет роли'}</i></span>}
          </div>
        ))}
      </Card>
    </div>
  );
}
