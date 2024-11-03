import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsernameTaken, UserNotFound } from '../application/addon/error';
import { AuthPayload } from '../auth/addon/auth.entity';
import { UpdateUserDto } from './addon/user.dto';
import { λthrow } from '@impactium/utils';
import { Optional, λLogger, λParam } from '@impactium/pattern';
import { Logger } from '../application/addon/logger.service';
import { ApplicationService } from '../application/application.service';
import { createHash, createHmac } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
    private readonly jwt: JwtService,
  ) {}

  findByEmail(email: string, select?: Prisma.UserSelect) {
    return this.prisma.user.findUnique({
      where: { email },
      select
    });
  }

  findById(uid: string, options: UserSelectOptions = {}): Promise<UserEntity | null> {
    return this.prisma.user.findUnique({
      where: { uid },
      ...UserEntity.select(options)
    }) as Promise<UserEntity | null>;
  }

  async update(uid: string, user: UpdateUserDto) {
    if (user.username) {
      await this.prisma.user.findFirst({
        where: { username: user.username }
      }) && λthrow(UsernameTaken);
    }

    return this.prisma.user.update({
      where: { uid },
      data: { ...user },
      ...UserEntity.select()
    });
  }
  
  public find = (search: string) => this.prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: search } },
        { displayName: { contains: search } },
      ]
    }
  });

  public impersonate = async (uid: string) => {
    const user = await this.prisma.user.findUnique({
      where: { uid },
      select: {
        email: true,
        username: true,
      }
    });

    if (!user) {
      Logger.warn(`Administrator tried impersonat user: ${λLogger.blue(uid)}`, 'λ');
      λthrow(UserNotFound)
    };

    Logger.warn(`Administrator impersonated user: ${λLogger.blue(user.username)}`, 'λ');

    return `Bearer ${this.signJWT(uid, user.email)}`;
  }

  public admin = async (keypass: string, throwable: boolean = true) => {
    const hash = createHmac('sha256', createHash('sha256').digest()).update(keypass).digest('hex');

    if (hash !== 'e639e6fda92901cfaa855bdf591fb9685ec4b3db4ebd469df579beb9fc7ee207') {
      Logger.warn(`Someone is tried to impersonate admin account with keypass ${keypass}`, UserService.name);
      if (throwable) λthrow(ForbiddenException);
      return;
    }

    Logger.log(`Someone is impersonated admin account with keypass ${keypass}`, UserService.name);

    return this.applicationService.createSystemAccount();
  }

  public inventory = (uid: string) => this.prisma.item.findMany({
    where: { user: { uid } }
  });

  signJWT = (uid: Required<AuthPayload['uid']>, email?: Optional<AuthPayload['email']>): string => this.jwt.sign({ uid, email }, { secret: process.env.JWT_SECRET, expiresIn: '7d' });

  decodeJWT = (token: string): { uid: string, email?: string } => this.jwt.decode(token) || λthrow(ForbiddenException);
}
