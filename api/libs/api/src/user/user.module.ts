import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@api/main/auth/auth.module';
import { ApplicationModule } from '../application/application.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  controllers: [UserController],
  imports: [
    JwtModule,
    PrismaModule,
    RedisModule,
    forwardRef(() => AuthModule),
    forwardRef(() => ApplicationModule),
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
