import { $Enums, Login, Prisma, Team, User } from "@prisma/client";
import { LoginEntity } from "./login.entity";
import { TeamEntity } from "@api/main/team/addon/team.entity";

export class UserEntity implements User {
  uid: string;
  register: Date;
  email: string | null;
  login?: LoginEntity
  teams?: TeamEntity[]

  constructor(user: UserEntity) {
    return Object.assign(this, user)
  }

  static select = (): Prisma.UserSelect => ({
    uid: true,
    email: true,
    register: true
  });

  static withTeams = () => ({
    ...this,
    ...this.select(),
    teams: true
  });
  
  static withLogin = () => ({
    ...this,
    ...this.select(),
    logins: {
      orderBy: {
        on: 'desc' as Prisma.SortOrder,
      },
      take: 1
    }
  });

  static fromPrisma(user: User & { logins: Login[], teams: Team[] }): UserEntity {
    return new UserEntity({
      uid: user.uid,
      register: user.register,
      email: user.email,
      login: user.logins[0],
      teams: user.teams,
    });
  }
}