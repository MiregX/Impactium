import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsernameTaken, UserNotFound } from '../application/addon/error';
import { AuthPayload } from '../auth/addon/auth.entity';
import { FindUserDto, UpdateUserDto } from './addon/user.dto';
import { λthrow } from '@impactium/utils';
import { Optional, λLogger, λParam } from '@impactium/pattern';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  findByEmail(email: string, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { email },
      select
    });
  }

  findById(uid: λParam.Username, options: UserSelectOptions = {}): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { uid },
      ...UserEntity.select(options)
    }) as Promise<UserEntity | null>;
  }

  async update(uid: string, user: UpdateUserDto) {
    if (user.username) {
      await this.prisma.user.findFirst({
        where: { username: user.username }
      }) && λthrow(UsernameTaken);
    }

    return this.prisma.user.update({
      where: { uid },
      data: { ...user },
      ...UserEntity.select()
    });
  }
  
  public find = (search: string) => this.prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: search } },
        { displayName: { contains: search } },
      ]
    }
  });

  public impersonate = async (uid: string) => {
    const user = await this.prisma.user.findUnique({
      where: { uid },
      select: {
        email: true,
        username: true,
      }
    });

    if (!user) λthrow(UserNotFound);

    Logger.warn(`Administrator impersonated user: ${λLogger.blue(user.username)}`, 'λ');

    return `Bearer ${this.signJWT(uid, user.email)}`;
  }

  signJWT = (uid: Required<AuthPayload['uid']>, email?: Optional<AuthPayload['email']>): string => this.jwt.sign({ uid, email }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

  decodeJWT = (token: string) => this.jwt.decode(token) || λthrow(ForbiddenException);
}
