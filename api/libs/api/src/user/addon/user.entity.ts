import { $Enums, Prisma, User } from "@prisma/client";
import { LoginEntity } from "./login.entity";
import { TeamEntity } from "@api/main/team/addon/team.entity";

export class UserEntity implements User {
  // Исправить email usage
  uid: string;
  register: Date;
  email: string;
  login?: LoginEntity
  teams?: TeamEntity[]

  constructor({ email }: UserEntity) {
    this.email = email
  }

  static select = (): Prisma.UserSelect => ({
    uid: true,
    email: true,
    register: true
  })

  static withTeams = (select?: Prisma.UserSelect) => ({
    ...this.select(),
    ...select,
    teams: true
  })
  
  static withLogin = (select?: Prisma.UserSelect) => ({ 
    ...this.select(),
    ...select,
    logins: {
      orderBy: {
        on: 'desc' as Prisma.SortOrder,
      },
      take: 1
    }
  })
}