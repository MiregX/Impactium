import { Configuration } from '@impactium/config';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@api/main/main/main.module';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';

@Module({
  providers: [AnalyticsService],
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
    MainModule
  ]
})
export class ApiModule {} // implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(RequestMiddleware, ResponseMiddleware).forRoutes('*');
  // }
// }