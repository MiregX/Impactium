import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '@api/main/prisma/prisma.service';
import { UserService } from '@api/main/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  controllers: [AuthController],
  providers: [ 
    AuthService,
    AuthGuard,
    PrismaService,
    UserService,
    JwtService,
  ],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
