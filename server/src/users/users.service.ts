import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, AuthPayload } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  
  async findUniqueOrCreate(payload: AuthPayload): Promise<CreateUserDto> {
    return await this.prisma.user.findUnique({
      where: { email: payload.email },
    }) ?? await this.prisma.user.create({
      data: {
        lastLogin: payload.type,
        email: payload.email,
      },
    });
  }  
}

// const jwt = this.jwtService.sign({
//   createdUser: createdUser.id,
//   email: createdUser.email
// });
// return jwt;