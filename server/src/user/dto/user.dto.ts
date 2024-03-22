import { $Enums, Prisma } from "@prisma/client";

export class CreateUserDto implements Prisma.UserCreateInput {
  lastLogin: $Enums.LoginType;
  email: string;
}

export class UpdateUserDto implements Prisma.UserUpdateInput {
  lastLogin?: Prisma.EnumLoginTypeFieldUpdateOperationsInput | $Enums.LoginType;
  logins?: Prisma.LoginCreateNestedManyWithoutUserInput;
}

export class UserRequestDto {
  id: string
  email?: string
}
