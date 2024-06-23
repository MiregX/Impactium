import { DisplayName } from "@impactium/pattern";
import { $Enums, Prisma } from "@prisma/client";
import { IsNotEmpty, Matches } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
  lastLogin: $Enums.LoginType;
  email: string;
}

export class UpdateUserDto implements Prisma.UserUpdateInput {
  lastLogin?: Prisma.EnumLoginTypeFieldUpdateOperationsInput | $Enums.LoginType;
  logins?: Prisma.LoginCreateNestedManyWithoutUserInput;
}

export class UpdateUserDisplayNameDto implements Prisma.UserUpdateInput {
  @IsNotEmpty()
  @Matches(DisplayName, { message: 'displayName_invalid_format' })
  displayName: string;
}

export class UserRequestDto {
  id: string
  email?: string
}
