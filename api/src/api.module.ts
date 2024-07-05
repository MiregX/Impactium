import { Configuration } from '@impactium/config';
import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@api/main/main/main.module';
import { McsModule } from '@api/mcs';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestMiddleware } from '@api/main/application/addon/request.middleware';
import { ResponseMiddleware } from '@api/main/application/addon/response.middleware';

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
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware, ResponseMiddleware).forRoutes('*');
  }
}