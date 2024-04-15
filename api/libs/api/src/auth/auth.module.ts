import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserService } from '@api/main/user/user.service';
import { LoginService } from '@api/main/user/login.service';
import { JwtService } from '@nestjs/jwt';
import { ApplicationService } from '@api/main/application/application.service';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [ 
    AuthService,
    AuthGuard,
    PrismaService,
    ApplicationService,
    UserService,
    LoginService,
    JwtService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
