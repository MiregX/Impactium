import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ApiController } from './api.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { ApplicationModule } from './application/application.module';
@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PlayerModule,
    ConfigModule.forRoot({
      envFilePath: `../${!process.env.X && 'dev'}.env`,
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ApplicationModule,
  ],
  controllers: [
    ApiController
  ],
  providers: [
    ApiService
  ],
})
export class ApiModule {}