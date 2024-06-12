import { ApplicationModule } from '@api/main/application/application.module';
import { PrismaModule } from '@api/main/prisma/prisma.module';
import { UserModule } from '@api/main/user/user.module';
import { AuthModule } from '@api/main/auth/auth.module';
import { Module } from '@nestjs/common';
import { TeamModule } from '@api/main/team/team.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    TeamModule,
    ApplicationModule,
  ],
})
export class MainModule {}
