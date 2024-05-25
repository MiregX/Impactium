import { Injectable } from '@nestjs/common';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { CommentTypeDto, CommentDto } from './addon/comment.dto';
import { CommentEntity } from './addon/comment.entity';
@Injectable()
export class CommentService {
  post({ uid, indent, type, comment }: {
    uid: string,
    indent: string,
    type: CommentTypeDto,
    comment: CommentDto
  }) {
    return this.prisma.comment.create({
      data: comment
    })
  }
  constructor(
    private readonly prisma: PrismaService
  ) {}

  finyManyByIndent(
    indent: string,
    type: CommentTypeDto
  ) {
    return this.prisma.team.findMany({
      where: {
        indent
      }
    })
  }

  async create({
    uid,
    indent,
    type,
    content,
  }: {
    uid: string,
    indent: string,
    type: CommentTypeDto,
    content: string,
  }) {
    const comment = await this.prisma.comment.create({
      data: {
        uid,
        content
      }
    })
  }
}