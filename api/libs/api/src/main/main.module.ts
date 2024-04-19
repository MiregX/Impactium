import { ApplicationModule } from '@api/main/application/application.module';
import { PlayerModule } from '@api/main/player/player.module';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '@api/main/user/user.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { MainController } from './main.controller';
import { MainService } from './main.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    PlayerModule,
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
