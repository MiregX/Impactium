import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsernameTakenException } from '../application/addon/error';
import { AuthPayload } from '../auth/addon/auth.entity';
import { UpdateUserDto } from './addon/user.dto';
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

  findById(uid: string, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { uid },
      select
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
      select: UserEntity.select()
    });
  }

  async setDisplayName(uid: string, displayName: string) {
    const user = await this.prisma.user.update({
      where: { uid },
      data: { displayName },
      select: UserEntity.select()
    });
    return UserEntity.fromPrisma(user);
  }

  signJWT(uid: Required<AuthPayload['uid']>, email: AuthPayload['email']): string {
    return this.jwt.sign({
      uid,
      email,
    }, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d'
    });
  }

  decodeJWT(token: string) {
    const data = this.jwt.decode(token);
    return data || new ForbiddenException();
  }
}
