import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { UsernameTakenException } from './addon/user.error';

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

  async setUsername(uid: string, username: string) {
    const exist = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username },
          {
            logins: {
              some: {
                username
              }
            }
          }
        ]
      }
    });

    if (exist) throw new UsernameTakenException();

    return this.prisma.user.update({
      where: { uid },
      data: { username }
    });
  }

  setDisplayName(uid: string, displayName: string) {
    return this.prisma.user.update({
      where: { uid },
      data: { displayName }
    });
  }
  
  signJWT(uid: string, email: string): string {
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
