import { forwardRef, Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { RedisModule } from '@api/main/redis/redis.module';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [
    PrismaModule,
    RedisModule,
    AuthModule,
    forwardRef(() => UserModule)
  ],
  exports: [ApplicationService],
})
export class ApplicationModule { }
