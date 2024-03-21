import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtService],
  imports: [UsersModule],
  exports: [AuthService],
})
export class AuthModule {}
