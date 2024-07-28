import { Avatar } from "@/components/Avatar";
import { TeamMember } from "@/dto/TeamMember";

export function TeamUnitRoles({ members }: { members?: TeamMember[] }) {
  return (
    <div>
      {members && members.map((member: TeamMember) => {
        return <Avatar size={32} src={member.user.avatar} alt={member.user.displayName} />
      })}
    </div>
  );
}