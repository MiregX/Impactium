import { ConfigModule } from '@nestjs/config';
import { MainModule } from '@api/main/main/main.module';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RequestMiddleware } from '@api/main/application/addon/request.middleware';
import { ResponseMiddleware } from '@api/main/application/addon/response.middleware';
import { Configuration } from './configuration';

@Module({
  providers: [],
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
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware, ResponseMiddleware).forRoutes('*');
  }
}