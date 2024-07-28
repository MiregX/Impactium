import { UserEntity } from "@api/main/user/addon/user.entity";
import { $Enums, Prisma, TeamMember } from "@prisma/client";

export class TeamMemberEntity implements TeamMember {
  id: string;
  uid: string;
  tid: string;
  roles: $Enums.Roles[];
  user?: UserEntity;

  static select = ({ user }: Options = {}) => ({
    id: true,
    tid: true,
    uid: true,
    roles: true,
    user: user && {
      select: UserEntity.select()
    },
  })
}

interface Options {
  user?: boolean
}