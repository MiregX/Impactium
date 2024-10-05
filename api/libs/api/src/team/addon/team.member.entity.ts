import { UserEntity } from "@api/main/user/addon/user.entity";
import { $Enums, Prisma, TeamMember } from "@prisma/client";
import { TeamEntity } from "./team.entity";

export class TeamMemberEntity implements TeamMember {
  id!: string;
  uid!: string;
  indent!: string;
  role!: $Enums.Role | null;
  user?: UserEntity;

  public static select = ({ user }: Options = {}): Prisma.TeamMemberDefaultArgs => ({
    select: {
      id: true,
      indent: true,
      uid: true,
      role: true,
      user: user && UserEntity.select()
    }
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