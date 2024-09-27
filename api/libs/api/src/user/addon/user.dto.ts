import { DisplayName, DisplayNameBase, Identifier, λError } from "@impactium/pattern";
import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Prisma } from "@prisma/client";
import { IsNotEmpty, IsOptional, Matches } from "class-validator";

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
    message: λError.displayName_invalid_format
  })
  displayName?: string
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
