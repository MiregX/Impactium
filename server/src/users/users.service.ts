import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto, LoginPayload } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(payload: LoginPayload): Promise<UserEntity | string> {
    const user: CreateUserDto = this.serialize(payload);
    const createdUser = await this.prisma.user.create({
      data: user
    });

    const jwt = this.jwtService.sign({
      createdUser: createdUser.id,
      email: createdUser.email
    });

    return jwt;
  }

  private serialize(payload: LoginPayload): CreateUserDto {
    let avatar = '';
    let id = '';
    let displayName = '';
    let locale = '';
    const isGoogleLogin = payload.lastLogin === 'google';
    const isDiscordLogin = payload.lastLogin === 'discord';
    if (isGoogleLogin) {
      avatar = payload.picture || '';
      id = payload.sub;
      displayName = payload.name;
      locale = payload.locale;
    }
    else if (isDiscordLogin) {
      avatar = payload.avatar
        ? `https://cdn.discordapp.com/avatars/${payload.id}/${payload.avatar}.png`
        : '';
      id = payload.id;
      displayName = payload.global_name || `${payload.username}#${payload.discriminator}`;
      locale = payload.locale;
    }
  
    const user: CreateUserDto = {
      lastLogin: payload.lastLogin,
      email: payload.email,
      logins: {
        create: {
          avatar,
          displayName,
          locale,
          type: payload.lastLogin,
          id: id,
        },
      },
    };
  
    return user;
  }
}
