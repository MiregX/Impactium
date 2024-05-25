import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '@api/main/user/user.module';
import { CommentController } from './comment.controller';

@Module({
  providers: [CommentService],
  exports: [CommentService],
  imports: [PrismaModule, UserModule],
  controllers: [CommentController]
})
export class RedisModule {}
