import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '@api/main/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, LoginService],
  imports: [JwtModule, AuthModule, PrismaModule],
  exports: [UserService, LoginService],
})
export class UserModule {}
