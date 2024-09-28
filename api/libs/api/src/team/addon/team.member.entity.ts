import { UserEntity } from "@api/main/user/addon/user.entity";
import { $Enums, TeamMember } from "@prisma/client";
import { TeamEntity } from "./team.entity";

export class TeamMemberEntity implements TeamMember {
  id!: string;
  uid!: string;
  indent!: string;
  role!: $Enums.Role | null;
  user?: UserEntity;

  static select = ({ user }: Options = {}) => ({
    id: true,
    indent: true,
    uid: true,
    role: true,
    user: user && {
      select: UserEntity.select()
    },
  });

  static create = ({ uid, indent }: CreateTeamMemberOptions) => ({
    uid,
    indent,
  })
}

interface Options {
  user?: boolean
}

interface CreateTeamMemberOptions {
  uid: UserEntity['uid']
  indent: TeamEntity['indent']
}