import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  imports: [PrismaModule],
  exports: [UsersService],
})
export class UsersModule {}
