import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { MainController } from './main.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MainService } from './main.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { PlayerModule } from './player/player.module';
import { ApplicationModule } from './application/application.module';
import { Configuration } from '@impactium/config';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PlayerModule,
    ConfigModule.forRoot({
      envFilePath: `../${Configuration.isProductionMode() ? '' : 'dev'}.env`,
      load: [() => Configuration.processEnvVariables()],
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ApplicationModule,
  ],
  controllers: [
    MainController
  ],
  providers: [
    MainService
  ],
})
export class MainModule {}
