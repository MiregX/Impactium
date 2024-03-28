import { $Enums, Login, Prisma, User } from "@prisma/client";
import { LoginEntity } from "./login.entity";

interface UserEntityInput extends User {

}

export class UserEntity implements UserEntityInput {
  id: string;
  register: Date;
  email: string;
  lastLogin: $Enums.LoginType;

  constructor(data: UserEntityInput) {
    this.lastLogin = data.lastLogin,
    this.email = data.email
  }
}

type UserFulfilledEntityInput = UserEntity & LoginEntity 

export class UserFulfilledEntity implements UserFulfilledEntityInput {
  id: string;
  register: Date;
  email: string;
  lastLogin: $Enums.LoginType;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;
  userId: string;

  static compare({user, login}: {user: UserEntity, login: LoginEntity}): UserFulfilledEntity {
    return Object.assign(user, login)
  }
}