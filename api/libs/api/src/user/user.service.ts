import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity,  } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}


  async findOneByEmail(email: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  async findOneById(uid: string, select?: Prisma.UserSelect): Promise<Partial<UserEntity>> {
    return await this.prisma.user.findUnique({
      where: { uid },
      select
    });
  }

  compareUserWithLogin(uid: string): Promise<Partial<UserEntity>> {
    const select = UserEntity.withLogin()
    const selectA = UserEntity.withTeams(select)
    return this.findOneById(uid, selectA);
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
