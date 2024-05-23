import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { CommentTypeDto } from './addon/commentType.dto';
import { CommentEntity } from './addon/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService
  ) {}
  finyManyByIndent(
    indent: string,
    type: CommentTypeDto
  ) {
    return this.prisma[type].findMany({
      where: {
        indent
      },
      select: CommentEntity.withUser()
    })
  }

  async create({
    uid: string,
    indent: string,
    type: CommentTypeDto,
    content: string,
  }) {
     cosnt comment = await this.prisma.comment.create({
      data: {
        uid,
        content
      }
    })
  }
}