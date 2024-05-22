import { $Enums, Prisma, User } from "@prisma/client";
import { LoginEntity } from "./login.entity";
import { TeamEntity } from "@api/main/team/addon/team.entity";


export class UserEntity implements User {
  uid: string;
  register: Date;
  email: string;
  teams?: TeamEntity[];
  
  constructor({ email }: User) {
    this.email = email
  }
}

type UserComposedEntityInput = UserEntity & LoginEntity

export class UserComposedEntity implements UserComposedEntityInput {
  id: string;
  lang: string;
  on: Date;
  uid: string;
  register: Date;
  email: string;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;

  static compose({user, login}: {user: UserEntity, login: LoginEntity}): UserComposedEntity {
    return {
      ...{
        ...user,
        teams: user.teams.length > 0 ? user.teams : undefined
      },
      ...login
    }
  }

  static select = (): Prisma.UserSelect => ({
    uid: true,
    email: true,
    register: true
  })

  static withTeams = (): Prisma.UserSelect => ({ ...this.select(), teams: true })
}