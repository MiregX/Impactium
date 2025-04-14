import { DisplayName, DisplayNameBase, Identifier, λError } from "@impactium/types";
import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class CreateUserDto implements Prisma.UserCreateInput {
  lastLogin!: $Enums.LoginType;
  email!: string;
}

export class UpdateUserDto implements Prisma.UserUpdateInput {
  @IsOptional()
  @Matches(Identifier.Username, {
    message: λError.username_invalid_format
  })
  username?: string

  @IsOptional()
  @Matches(DisplayName.base, {
    message: λError.display_name_invalid_format
  })
  displayName?: string
}

export class FindUserDto {
  @IsNotEmpty()
  @IsString()
  search?: string
}

export class UpdateUserDisplayNameDto implements Prisma.UserUpdateInput {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(DisplayNameBase, { message: 'displayName_invalid_format' })
  displayName!: string;
}

export class UserRequestDto {
  displayName!: string
  email?: string
}
