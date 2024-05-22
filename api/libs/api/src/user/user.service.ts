import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity,  } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}


  findOneByEmail(email: string, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { email },
      select
    });
  }

  findOneById(uid: string, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { uid },
      select
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
    return data || new NotFoundException();
  }
}
