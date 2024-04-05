import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { LoginService } from 'src/user/login.service';
import { JwtService } from '@nestjs/jwt';
import { ApplicationService } from 'src/application/application.service';
import { Configuration } from '@impactium/config';

@Module({
  controllers: [AuthController],
  providers: [ 
    AuthService,
    PrismaService,
    ApplicationService,
    UserService,
    LoginService,
    JwtService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
