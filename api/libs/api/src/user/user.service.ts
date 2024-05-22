import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserComposedEntity, UserEntity,  } from './addon/user.entity';
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

  async findOneById(uid: string, select?: Prisma.UserSelect): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: { uid },
      select
    });
  }

  async compareUserWithLogin(uid: string): Promise<any> {
    const user = await this.findOneById(uid, UserComposedEntity.withTeams());
    const login = await this.prisma.login.findFirst({
      where: {
        uid: user.uid,
      },
      orderBy: {
        on: 'desc',
      },
    });
    
    return UserComposedEntity.compose({
      user,
      login
    });
  }
  
  signJWT(uid: string, email: string): string {
    return this.jwt.sign({
      uid,
      email,
    }, {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: '7d'
    });
  }

  decodeJWT(token: string) {
    const data = this.jwt.decode(token);
    return data || new NotFoundException();
  }
}
