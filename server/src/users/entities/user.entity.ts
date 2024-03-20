import { $Enums, Prisma } from "@prisma/client";

export class UserEntity {
  id: string
  email: string;
  lastLogin: $Enums.LoginType;
  register: string | Date;
  logins?: Prisma.LoginCreateNestedManyWithoutUserInput;
  player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
}