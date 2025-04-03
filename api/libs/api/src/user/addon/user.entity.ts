import { ApiProperty } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { LoginEntity } from './login.entity';
import { λParam } from '@impactium/pattern';

export class UserEntity implements User {
  @ApiProperty({ example: crypto.randomUUID(), description: 'User ID from database' })
  uid!: λParam.Id;

  @ApiProperty({ example: new Date().toISOString(), description: 'Registration date of the user' })
  registered!: Date;

  @ApiProperty({ example: 'user@impactium.fun', description: 'Email address of the user', nullable: true })
  email!: string | null;

  @ApiProperty({ example: 'username', description: 'Username of the user', nullable: true })
  username!: string | null;

  @ApiProperty({ example: 'https://cdn.impactium.fun/logo/impactium.svg', description: 'Avatar URL of the user' })
  avatar!: string | null;

  @ApiProperty({ example: 'displayName', description: 'Display name of the user', nullable: true })
  displayName!: string | null;

  @ApiProperty({ type: LoginEntity, description: 'Latest login entity of the user', nullable: true })
  login?: LoginEntity;

  @ApiProperty({ type: [LoginEntity], description: 'All login entities of the user', nullable: true })
  logins?: LoginEntity[];

  constructor(user: UserEntity) {
    return Object.assign(this, user);
  }

  public static select = ({ logins = false }: UserSelectOptions = {}): Prisma.UserDefaultArgs => ({
    select: {
      uid: true,
      email: true,
      registered: true,
      displayName: true,
      username: true,
      avatar: true,
      logins: logins ? true : {
        orderBy: {
          on: 'desc' as Prisma.SortOrder,
        },
        take: 1,
      },
    }
  });

  static fromPrisma(
    user: UserEntity,
    { logins }: UserSelectOptions = {},
  ): UserEntity {
    return new UserEntity({
      uid: user.uid,
      registered: user.registered,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      email: user.email,
      login: user.logins![0],
      logins: logins ? user.logins : undefined,
    });
  }
}

export interface UserSelectOptions {
  logins?: boolean;
}
