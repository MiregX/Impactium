import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService, LoginService],
  imports: [JwtModule, AuthModule, PrismaModule],
  exports: [UserService, LoginService],
})
export class UserModule {}
