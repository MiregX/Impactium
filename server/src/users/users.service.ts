import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity, UserFulfilledEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
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

  async jwt(user: UserFulfilledEntity) {
    return this.jwtService.sign(user);
  }
}
