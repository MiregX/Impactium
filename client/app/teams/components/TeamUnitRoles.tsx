import { Avatar } from "@/components/Avatar";
import { TeamMember } from "@/dto/TeamMember";

export function TeamUnitRoles({ members }: { members?: TeamMember[] }) {
  return (
    <div>
      {members && members.map((member: TeamMember) => {
        return <Avatar size={32} src={member.user.login.avatar} alt={useDisplayName(member.user)} />
      })}
    </div>
  );
}