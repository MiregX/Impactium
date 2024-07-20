import { DisplayNameBase } from "@impactium/pattern";
import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty()
  @IsNotEmpty()
  @Matches(DisplayNameBase, { message: 'displayName_invalid_format' })
  displayName: string;
}

export class UserRequestDto {
  id: string
  email?: string
}
