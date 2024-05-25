import {
  Controller,
  Get,
  Post,
  UseGuards,
  Param,
  Body
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '@api/main/auth/addon/auth.guard';
import { IndentValidationPipe } from '@api/main/application/addon/indent.pipe';
import { CommentTypeValidationPipe } from './addon/comment.pipe';
import { CommentEntity } from './addon/comment.entity';
import { UserEntity } from '@api/main/user/addon/user.entity';
import { User } from '@api/main/user/addon/user.decorator';
import { CommentDto, CommentTypeDto } from './addon/comment.dto';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService
  ) {}

  @Get('get/:type/:indent')
  get(
    @Param('type', CommentTypeValidationPipe) type: CommentTypeDto,
    @Param('indent', IndentValidationPipe) indent: string,
  ): CommentEntity {
    return this.commentService.finyManyByIndent(indent, type)
  }

  // /api/comment/post/team/some-indent
  @Post('post/:type/:indent')
  @UseGuards(AuthGuard)
  post(
    @User() user: UserEntity,
    @Body() body: CommentDto,
    @Param('type', CommentTypeValidationPipe) type: CommentTypeDto,
    @Param('indent', IndentValidationPipe) indent: string,
  ) {
    console.log(body);
    return this.commentService.post({
      uid: user.uid,
      indent,
      type,
      comment: body
    })
  }
}