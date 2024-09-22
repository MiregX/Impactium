import { ApiProperty } from '@nestjs/swagger';
import { Login, Prisma, Team, User } from '@prisma/client';
import { LoginEntity } from './login.entity';
import { TeamEntity } from '@api/main/team/addon/team.entity';

export class UserEntity {
  @ApiProperty({ example: crypto.randomUUID(), description: 'User ID from database' })
  uid!: string;

  @ApiProperty({ example: new Date().toISOString(), description: 'Registration date of the user' })
  register!: Date;

  @ApiProperty({ example: 'user@impactium.fun', description: 'Email address of the user', nullable: true })
  email!: string | null;

  @ApiProperty({ example: 'username', description: 'Username of the user', nullable: true })
  username!: string | null;

  @ApiProperty({ example: 'https://cdn.impactium.fun/logo/impactium.svg', description: 'Avatar URL of the user' })
  avatar!: string | null;

  @ApiProperty({ example: 'displayName', description: 'Display name of the user', nullable: true })
  displayName!: string | null;

  @ApiProperty({ example: true, description: 'Indicates if the user is verified' })
  verified!: boolean;

  @ApiProperty({ type: LoginEntity, description: 'Latest login entity of the user', nullable: true })
  login?: LoginEntity;

  @ApiProperty({ type: [LoginEntity], description: 'All login entities of the user', nullable: true })
  logins?: LoginEntity[];

  @ApiProperty({ type: [TeamEntity], description: 'Teams the user belongs to', nullable: true })
  teams?: TeamEntity[];

  constructor(user: UserEntity) {
    return Object.assign(this, user);
  }

  static select = ({ teams = false, logins = false }: Options = {}): Prisma.UserSelect => ({
    uid: true,
    email: true,
    register: true,
    displayName: true,
    verified: true,
    username: true,
    avatar: true,
    logins: logins ? true : {
      orderBy: {
        on: 'desc' as Prisma.SortOrder,
      },
      take: 1,
    },
    teams: teams && {
      select: TeamEntity.select({ members: true })
    }
  });

  static fromPrisma(
    user: UserEntity,
    { teams, logins }: Options = {},
  ): UserEntity {
    return new UserEntity({
      uid: user.uid,
      register: user.register,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      email: user.email,
      login: user.logins![0],
      teams: teams ? user.teams : undefined,
      logins: logins ? user.logins : undefined,
      verified: user.verified,
    });
  }
}

interface Options {
  logins?: boolean;
  teams?: boolean;
}
