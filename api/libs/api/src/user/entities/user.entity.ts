import { $Enums, User } from "@prisma/client";
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

type UserComposedEntityInput = UserEntity & LoginEntity

export class UserComposedEntity implements UserComposedEntityInput {
  uid: string;
  id: string;
  register: Date;
  email: string;
  lastLogin: $Enums.LoginType;
  type: $Enums.LoginType;
  avatar: string;
  displayName: string;
  locale: string;

  static compose({user, login}: {user: UserEntity, login: LoginEntity}): UserComposedEntity {
    const fulfilledUser: UserComposedEntity = {
      id: login.id,
      uid: user.id,
      lastLogin: login.type,
      register: user.register,
      email: user.email,
      avatar: login.avatar,
      displayName: login.displayName,
      locale: login.locale,
      type: login.type
    }
    
    return fulfilledUser
  }
}