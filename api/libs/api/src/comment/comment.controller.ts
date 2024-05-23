import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body
} from '@nest/commnon';
import { commentService } from './comment.service';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { PrismaService } from '@api/main/auth/addon/auth.guard';
import { IndentValidationPipe } from '@api/main/application/addon/indent.decorator';
import { CommentTypeValidationPipe } from './addon/type.decorator';
import { CommentEntity } from './addon/comment.entuty';
import { UserEntity } from '@api/main/user/addon/user.entuty';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly prisma: PrismaService
  )

  @Get('get/:type/:indent')
  get(
    @Param('type', CommentTypeValidationPipe) type: string,
    @Param('indent', IndentValidationPipe) id: string,
  ): CommentEntity {
    return this.commentService.findOneById(indent, type)
  }

  @Post('post/:indent')
  @UseGuard(AuthGuard)
  post(
    @User() user: UserEntity,
    @Comment() comment: CommentEntity
    @Param('id') id: string,
  ) {
    return this.commentService.
  }
}