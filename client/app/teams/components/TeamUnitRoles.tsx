import { Avatar } from "@/components/Avatar";
import { useAvatar } from "@/decorator/useAvatar";
import { TeamMember } from "@/dto/TeamMember";

export function TeamUnitRoles({ members }: { members?: TeamMember[] }) {
  return (
    <div>
      {members && members.map((member: TeamMember) => {
        return <Avatar size={32} src={useAvatar(member.user)} alt={useDisplayName(member.user)} />
      })}
    </div>
  );
}