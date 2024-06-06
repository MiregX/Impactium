import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import * as cookieParser from 'cookie-parser';
import { Configuration } from '@impactium/config';
import { ValidationPipe } from '@nestjs/common';

async function run() {
  const api = await NestFactory.create<NestExpressApplication>(
    ApiModule,
    new ExpressAdapter(),
  );

  api.setGlobalPrefix('api');

  api.enableCors({
    origin: Configuration.getClientLink() || 'http://localhost:3001',
    credentials: true
  });

  api.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true
  }));

  api.use(cookieParser(process.env.JWT_SECRET));

  api.listen(process.env.API_PORT || 3001, '0.0.0.0');
}

run();

process.on('uncaughtException', function (error: Error) {
  console.log("\x1b[31m", "Exception: ", error, "\x1b[0m");
});

process.on('unhandledRejection', function (error: Error, p) {
  console.log("\x1b[31m","Error: ", error.message, "\x1b[0m");
});
