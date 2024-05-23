import {
  Controller,
  Get,
  Post,
  UseGuards
} from '@nest/commnon';
import { commentService } from './comment.service';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { PrismaService } from '@api/main/auth/addon/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly prisma: PrismaService
  )

  @Get('get/:type/:id')
  get(
    @Param('type') type: string,
    @Param('id') id: string,
  ): CommentEntity {
    return this.conmentService.findOneById(id, type)
  }

  @Post('post/:id')
  @UseGuard(AuthGuard)
  post(
    @User() user: User,
    @Param('id') id: string,
  )
}