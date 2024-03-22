import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { PlayerModule } from './player/player.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule.register({
      secret: "bfhoibfieapfeihafiohea",
      signOptions: { expiresIn: '7d' },
    }),
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    PlayerModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}