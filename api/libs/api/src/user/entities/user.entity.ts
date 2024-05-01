import { $Enums, User } from "@prisma/client";
import { LoginEntity } from "./login.entity";

interface UserEntityInput extends User {

}

export class UserEntity implements UserEntityInput {
  uid: string;
  register: Date;
  email: string;

  constructor(data: UserEntityInput) {
    this.email = data.email
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
    const fulfilledUser: UserComposedEntity = {
      uid: user.uid,
      register: user.register,
      email: user.email,
      avatar: login.avatar,
      displayName: login.displayName,
      type: login.type,
      on: login.on,
      lang: login.lang,
      id: login.id
    }
    
    return fulfilledUser
  }
}