import { $Enums, Prisma } from "@prisma/client";
import { CreateUserDto } from "../dto/user.dto";

export class UserEntity implements CreateUserDto {
  id: string
  lastLogin: $Enums.LoginType;
  email?: string;
  logins: Prisma.LoginCreateNestedManyWithoutUserInput;
  register: string | Date;
  player?: Prisma.PlayerCreateNestedOneWithoutUserInput;
}