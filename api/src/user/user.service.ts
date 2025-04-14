import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prism/prisma.service';
import { UserEntity, UserSelectOptions } from './addon/user.entity';
import { UsernameTaken, UserNotFound } from '../application/addon/error';
import { UpdateUserDto } from './addon/user.dto';
import { λthrow } from '@impactium/utils';
import { Logger } from '../application/addon/logger.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

<<<<<<< Updated upstream:api/libs/api/src/user/user.service.ts
  findById(uid: string, options: UserSelectOptions = {}): Promise<UserEntity | null> | null {
=======
  findById(uid: UserEntity['uid'], options: UserSelectOptions = {}): Promise<UserEntity | null> | null {
>>>>>>> Stashed changes:api/src/user/user.service.ts
    if (typeof uid !== 'string') {
      Logger.error(`Recieved uid: ${uid} as \${${typeof uid}}`)
      return null;
    }

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
}
