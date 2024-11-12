import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsernameTaken, UserNotFound } from '../application/addon/error';
import { UpdateUserDto } from './addon/user.dto';
import { λthrow } from '@impactium/utils';
import { λLogger, λParam } from '@impactium/pattern';
import { Logger } from '../application/addon/logger.service';
import { ApplicationService } from '../application/application.service';
import { createHash, createHmac } from 'crypto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => ApplicationService))
    private readonly applicationService: ApplicationService,
  ) {}

  findById(uid: λParam.Id, options: UserSelectOptions = {}): Promise<UserEntity | null> {
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

  public admin = async (keypass: string, throwable: boolean = true) => {
    const hash = createHmac('sha256', createHash('sha256').digest()).update(keypass).digest('hex');

    // if (hash !== 'e639e6fda92901cfaa855bdf591fb9685ec4b3db4ebd469df579beb9fc7ee207') {
    if (hash !== '59c1a72ebf069768ce56f31a608d1787fa7b89b2c4c778e2ff21bde7870b0777') {
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
}
