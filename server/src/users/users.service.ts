import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  
  async findUniqueOrCreate(payload: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.prisma.user.findUnique({
        where: { email: payload.email },
      }) ?? await this.prisma.user.create({
        data: payload,
      });
    } catch(_) {
      throw new RequestTimeoutException();
    }
  }

  async find(x) {
    return await this.prisma.user.findUnique({
      where: x
    });
  }
}

// const jwt = this.jwtService.sign({
//   createdUser: createdUser.id,
//   email: createdUser.email
// });
// return jwt;