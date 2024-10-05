import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsernameTakenException, UserNotFound } from '../application/addon/error';
import { AuthPayload } from '../auth/addon/auth.entity';
import { FindUserDto, UpdateUserDto } from './addon/user.dto';
import { λthrow } from '@impactium/utils';

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

  findById(uid: string, options: UserSelectOptions = {}) {
    return this.prisma.user.findUnique({
      where: { uid },
      ...UserEntity.select(options)
    });
  }

  async update(uid: string, user: UpdateUserDto) {
    if (user.username) {
      await this.prisma.user.findFirst({
        where: { username: user.username }
      }) && λthrow(UsernameTakenException);
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
        uid: true,
        email: true
      }
    });

    Logger.warn(`Administrator impersonated user with id: ${user?.uid}`, 'λ');

    return user ? `Bearer ${this.signJWT(user.uid, user.email)}` : λthrow(UserNotFound);
  }

  signJWT = (uid: Required<AuthPayload['uid']>, email: AuthPayload['email']): string => this.jwt.sign({ uid, email }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

  decodeJWT = (token: string) => this.jwt.decode(token) || λthrow(ForbiddenException);
}
