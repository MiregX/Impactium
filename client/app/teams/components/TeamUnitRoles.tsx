import { Avatar } from "@/ui/Avatar";
import { TeamMember } from "@/dto/TeamMember";
import s from '../Teams.module.css';

export function TeamUnitRoles({ members }: { members?: TeamMember[] }) {
  return (
    <div className={s.roles}>
      {members && members.map((member: TeamMember) => {
        return <Avatar size={32} src={member.user.avatar} alt={member.user.displayName} />
      })}
    </div>
  );
}