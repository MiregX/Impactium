import { Configuration } from '@impactium/config';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@api/main';
import { McsModule } from '@api/mcs';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      load: [() => Configuration.processEnvVariables()],
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
    ScheduleModule.forRoot(),
    MainModule,
    McsModule,
  ],
})
export class ApiModule {}
