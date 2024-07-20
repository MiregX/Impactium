import { $Enums, Login } from "@prisma/client";
import { ApiProperty } from '@nestjs/swagger';

export class LoginEntity implements Login {
  @ApiProperty({ description: 'ID аккаунта с которого была произведена авторизация' })
  id: string;

  @ApiProperty({ description: 'User ID from database' })
  uid: string;

  @ApiProperty({
    description: 'The type of login',
    enum: [$Enums.LoginType],
  })
  type: $Enums.LoginType;

  @ApiProperty({ description: 'The avatar URL associated with the login' })
  avatar: string;

  @ApiProperty({ description: 'The display name associated with the login' })
  displayName: string;

  @ApiProperty({ description: 'The timestamp when the login occurred' })
  on: Date;
}
