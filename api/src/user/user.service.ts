import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity, UserFulfilledEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

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

  async findOneById(id: string): Promise<UserEntity> {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async compareUserWithLogin(id: string): Promise<UserFulfilledEntity> {
    const user = await this.findOneById(id);
    const login = await this.prisma.login.findUnique({
      where: {
        userId: user.id,
        type: user.lastLogin
      }
    });
    return UserFulfilledEntity.compare({
      user,
      login
    });
  }
  
  signJWT(id: string, email: string): string {
    return this.jwt.sign({
      id,
      email
    }, {
      secret: process.env.JWT_SECRET || 'secret'
    });
  }
}
